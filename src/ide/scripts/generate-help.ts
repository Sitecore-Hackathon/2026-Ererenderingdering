/**
 * Build-time script to generate help-data.json from:
 *   - monaco-completions.ts (categories + snippets)
 *   - sitecore-sdk.d.ts (JSDoc, @param, @returns, @example, signatures)
 *
 * Run: npx tsx scripts/generate-help.ts
 */

import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "../src/lib");
const completionsFile = fs.readFileSync(path.join(ROOT, "monaco-completions.ts"), "utf-8");
const dtsFile = fs.readFileSync(path.join(ROOT, "sitecore-sdk.d.ts"), "utf-8");

// ── 1. Parse categories + snippets from monaco-completions.ts ──

interface CompletionEntry {
  name: string; // e.g. "getItem"
  detail: string;
  documentation: string;
  insertText: string;
  category: string;
}

const CATEGORY_RE = /\/\/\s*──\s*(?:\d+\.\s*)?(.+?)\s*──/;

function parseCompletions(): CompletionEntry[] {
  const entries: CompletionEntry[] = [];
  let currentCategory = "Core";

  // Parse both sitecoreMethods and utilityFunctions
  const methodsSection = completionsFile.split("import {")[0];
  const lines = methodsSection.split("\n");
  let inObj = false;
  let braceDepth = 0;
  let currentObj = "";

  for (const line of lines) {
    const catMatch = line.match(CATEGORY_RE);
    if (catMatch) {
      currentCategory = catMatch[1].trim();
      continue;
    }

    // Detect start of an object literal (line with just `{`)
    if (!inObj && line.trim() === "{") {
      inObj = true;
      braceDepth = 1;
      currentObj = "{\n";
      continue;
    }

    if (inObj) {
      currentObj += line + "\n";
      for (const ch of line) {
        if (ch === "{") braceDepth++;
        if (ch === "}") braceDepth--;
      }
      if (braceDepth <= 0) {
        const labelMatch = currentObj.match(/label:\s*"(?:Sitecore\.)?(\w+)"/);
        const detailMatch = currentObj.match(/detail:\s*"(.+?)"/);
        const docMatch = currentObj.match(/documentation:\s*"(.+?)"/);

        if (labelMatch) {
          // Extract insertText — find the substring after "insertText:" until the closing },
          let insertText = "";
          const itIdx = currentObj.indexOf("insertText:");
          if (itIdx !== -1) {
            const rest = currentObj.substring(itIdx + "insertText:".length).trim();
            // Determine quote character
            const q = rest[0];
            if (q === "'" || q === '"') {
              // Find matching unescaped close quote
              let i = 1;
              while (i < rest.length) {
                if (rest[i] === "\\" ) { i += 2; continue; }
                if (rest[i] === q) break;
                i++;
              }
              insertText = rest.substring(1, i);
            } else if (q === "`") {
              const end = rest.indexOf("`", 1);
              insertText = rest.substring(1, end);
            }
          }

          entries.push({
            name: labelMatch[1],
            detail: detailMatch?.[1] ?? "",
            documentation: docMatch?.[1] ?? "",
            insertText,
            category: currentCategory,
          });
        }
        inObj = false;
        currentObj = "";
      }
    }
  }

  return entries;
}

// ── 2. Parse SitecoreSDK interface from d.ts ──

interface ParamInfo {
  name: string;
  type: string;
  description: string;
  optional: boolean;
}

interface MethodInfo {
  name: string;
  signature: string;
  description: string;
  params: ParamInfo[];
  returns: string;
  examples: string[];
}

interface TypeInfo {
  name: string;
  description: string;
  fields: { name: string; type: string; description: string }[];
}

function parseDts(): { methods: Record<string, MethodInfo>; types: Record<string, TypeInfo> } {
  const methods: Record<string, MethodInfo> = {};
  const types: Record<string, TypeInfo> = {};

  // ── Parse interfaces (types) ──
  const interfaceRe = /interface\s+(\w+)\s*\{([\s\S]*?)^\}/gm;
  let ifMatch;
  while ((ifMatch = interfaceRe.exec(dtsFile)) !== null) {
    const name = ifMatch[1];
    if (name === "SitecoreSDK") continue; // handled separately

    const body = ifMatch[2];
    const fields: { name: string; type: string; description: string }[] = [];

    const fieldRe = /\/\*\*\s*(.*?)\s*\*\/\s*\n\s*(\w+)(\??)\s*:\s*(.+?);/g;
    let fm;
    while ((fm = fieldRe.exec(body)) !== null) {
      fields.push({
        name: fm[2] + (fm[3] || ""),
        type: fm[4].trim(),
        description: fm[1].replace(/\s*\*\s*/g, " ").trim(),
      });
    }

    types[name] = { name, description: "", fields };
  }

  // ── Parse SitecoreSDK methods ──
  const sdkMatch = dtsFile.match(/interface\s+SitecoreSDK\s*\{([\s\S]*?)^\}/m);
  if (!sdkMatch) throw new Error("Could not find SitecoreSDK interface");
  const sdkBody = sdkMatch[1];

  // Split into method blocks: JSDoc comment + method signature
  const methodBlockRe = /(\/\*\*[\s\S]*?\*\/)\s*\n\s*(\w+)\s*\(([\s\S]*?)\)\s*:\s*(Promise<[\s\S]*?>)\s*;/g;
  let mm;
  while ((mm = methodBlockRe.exec(sdkBody)) !== null) {
    const jsdoc = mm[1];
    const name = mm[2];
    const paramsStr = mm[3];
    const returnType = mm[4].trim();

    // Parse JSDoc
    const descMatch = jsdoc.match(/\/\*\*\s*\n?\s*\*?\s*([\s\S]*?)(?:\n\s*\*\s*@|\s*\*\/)/);
    let description = "";
    if (descMatch) {
      description = descMatch[1]
        .split("\n")
        .map((l) => l.replace(/^\s*\*\s?/, "").trim())
        .filter(Boolean)
        .join(" ");
    }

    // Parse @param tags
    const paramTags: { name: string; description: string }[] = [];
    const paramRe = /@param\s+(\w+)\s*-?\s*(.*)/g;
    let pm;
    while ((pm = paramRe.exec(jsdoc)) !== null) {
      paramTags.push({ name: pm[1], description: pm[2].trim() });
    }

    // Parse @returns
    const returnsMatch = jsdoc.match(/@returns?\s+(.*)/);
    const returns = returnsMatch ? returnsMatch[1].trim() : returnType;

    // Parse @example blocks
    const examples: string[] = [];
    const exampleRe = /@example\s*\n([\s\S]*?)(?=\s*\*\s*@|\s*\*\/)/g;
    let em;
    while ((em = exampleRe.exec(jsdoc)) !== null) {
      const code = em[1]
        .split("\n")
        .map((l) => l.replace(/^\s*\*\s?/, ""))
        .filter((l) => l.trim())
        .join("\n")
        .trim();
      if (code) examples.push(code);
    }

    // Build params from the actual signature
    const params: ParamInfo[] = [];
    if (paramsStr.trim()) {
      // Split params carefully (handling nested generics/objects)
      const paramParts = splitParams(paramsStr);
      for (const part of paramParts) {
        const pMatch = part.trim().match(/^(\w+)(\??)\s*:\s*([\s\S]+)$/);
        if (pMatch) {
          const pName = pMatch[1];
          const optional = pMatch[2] === "?";
          const pType = pMatch[3].trim();
          const tagDesc = paramTags.find((t) => t.name === pName)?.description ?? "";
          params.push({ name: pName, type: pType, description: tagDesc, optional });
        }
      }
    }

    const signature = `(${paramsStr.trim()}) => ${returnType}`;

    methods[name] = { name, signature, description, params, returns, examples };
  }

  // Also parse single-line JSDoc methods (no @param)
  const simpleMethodRe = /\/\*\*\s*(.*?)\s*\*\/\s*\n\s*(\w+)\s*\(([\s\S]*?)\)\s*:\s*(Promise<[\s\S]*?>)\s*;/g;
  while ((mm = simpleMethodRe.exec(sdkBody)) !== null) {
    const name = mm[2];
    if (methods[name]) continue; // already parsed
    const description = mm[1].replace(/\s*\*\s*/g, " ").trim();
    const paramsStr = mm[3];
    const returnType = mm[4].trim();

    const params: ParamInfo[] = [];
    if (paramsStr.trim()) {
      const paramParts = splitParams(paramsStr);
      for (const part of paramParts) {
        const pMatch = part.trim().match(/^(\w+)(\??)\s*:\s*([\s\S]+)$/);
        if (pMatch) {
          params.push({ name: pMatch[1], type: pMatch[3].trim(), description: "", optional: pMatch[2] === "?" });
        }
      }
    }

    methods[name] = {
      name,
      signature: `(${paramsStr.trim()}) => ${returnType}`,
      description,
      params,
      returns: returnType,
      examples: [],
    };
  }

  // ── Parse top-level declare function entries ──
  const declFnRe = /(\/\*\*[\s\S]*?\*\/)\s*\ndeclare\s+function\s+(\w+)\s*\(([\s\S]*?)\)\s*:\s*(\w+)\s*;/g;
  let df;
  while ((df = declFnRe.exec(dtsFile)) !== null) {
    const jsdoc = df[1];
    const name = df[2];
    const paramsStr = df[3];
    const returnType = df[4].trim();

    const descMatch = jsdoc.match(/\/\*\*\s*\n?\s*\*?\s*([\s\S]*?)(?:\n\s*\*\s*@|\s*\*\/)/);
    let description = "";
    if (descMatch) {
      description = descMatch[1]
        .split("\n")
        .map((l) => l.replace(/^\s*\*\s?/, "").trim())
        .filter(Boolean)
        .join(" ");
    }

    const paramTags: { name: string; description: string }[] = [];
    const paramRe = /@param\s+(\w+)\s*-?\s*(.*)/g;
    let pm;
    while ((pm = paramRe.exec(jsdoc)) !== null) {
      paramTags.push({ name: pm[1], description: pm[2].trim() });
    }

    const examples: string[] = [];
    const exampleRe = /@example\s*\n([\s\S]*?)(?=\s*\*\s*@|\s*\*\/)/g;
    let em;
    while ((em = exampleRe.exec(jsdoc)) !== null) {
      const code = em[1]
        .split("\n")
        .map((l) => l.replace(/^\s*\*\s?/, ""))
        .filter((l) => l.trim())
        .join("\n")
        .trim();
      if (code) examples.push(code);
    }

    const params: ParamInfo[] = [];
    if (paramsStr.trim()) {
      const paramParts = splitParams(paramsStr);
      for (const part of paramParts) {
        const pMatch = part.trim().match(/^(\w+)(\??)\s*:\s*([\s\S]+)$/);
        if (pMatch) {
          const pName = pMatch[1];
          const tagDesc = paramTags.find((t) => t.name === pName)?.description ?? "";
          params.push({ name: pName, type: pMatch[3].trim(), description: tagDesc, optional: pMatch[2] === "?" });
        }
      }
    }

    // Only add if not already parsed from SitecoreSDK
    if (!methods[name]) {
      methods[name] = {
        name,
        signature: `(${paramsStr.trim()}) => ${returnType}`,
        description,
        params,
        returns: returnType,
        examples,
      };
    }
  }

  return { methods, types };
}

function splitParams(s: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let current = "";
  for (const ch of s) {
    if (ch === "," && depth === 0) {
      parts.push(current);
      current = "";
    } else {
      if (ch === "(" || ch === "<" || ch === "{" || ch === "[") depth++;
      if (ch === ")" || ch === ">" || ch === "}" || ch === "]") depth--;
      current += ch;
    }
  }
  if (current.trim()) parts.push(current);
  return parts;
}

// ── 3. Determine danger level ──

function getDangerLevel(name: string): "safe" | "mutating" | "destructive" {
  const destructive = ["deleteItem", "deleteItemVersion", "deleteTemplate", "deleteUser", "deleteRole",
    "deleteDomain", "deleteLanguage", "deleteLanguages", "deleteArchivedItem", "deleteArchivedVersion",
    "emptyArchive", "removeSite", "removeSiteCollection", "deleteRoleFromRoles", "deleteAccountsFromRole",
    "cleanUpDatabases"];
  const mutating = ["createItem", "createItemFromBranch", "updateItem", "renameItem", "moveItem", "copyItem",
    "addItemVersion", "uploadMedia", "publishItem", "publishLanguageSpecificItems", "publishSite",
    "publishWithOptions", "cancelPublishing", "rebuildIndexes", "populateManagedSchema", "rebuildLinkDatabase",
    "startWorkflow", "executeWorkflowCommand", "translatePage", "translateSite",
    "createTemplate", "updateTemplate", "createTemplateFolder", "scaffoldSolution", "createSite",
    "createSiteCollection", "renameSite", "renameSiteCollection", "cloneSite", "updateSitesPos",
    "addLanguage", "archiveItem", "archiveVersion", "setItemArchiveDate", "setVersionArchiveDate",
    "restoreArchivedItem", "restoreArchivedVersion", "configurePageDesigns",
    "createUser", "updateUser", "unlockUser", "enableUser", "disableUser", "resetUserSettings",
    "changeUserPassword", "createDomain", "createRole", "addRoleToRoles", "addAccountsToRole"];

  if (destructive.includes(name)) return "destructive";
  if (mutating.includes(name)) return "mutating";
  return "safe";
}

// ── 4. Normalize category IDs ──

function categoryId(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// ── 5. Build and output ──

const completions = parseCompletions();
const { methods: dtsMethods, types } = parseDts();

// Merge
interface HelpMethod {
  name: string;
  qualifiedName: string;
  category: string;
  categoryId: string;
  signature: string;
  description: string;
  params: ParamInfo[];
  returns: string;
  examples: string[];
  snippet: string;
  danger: "safe" | "mutating" | "destructive";
}

const methodsMap: Record<string, HelpMethod> = {};
const categoriesMap: Record<string, { id: string; name: string; methods: string[] }> = {};

for (const comp of completions) {
  const dts = dtsMethods[comp.name];

  const catId = categoryId(comp.category);
  if (!categoriesMap[catId]) {
    categoriesMap[catId] = { id: catId, name: comp.category, methods: [] };
  }
  categoriesMap[catId].methods.push(comp.name);

  const isUtility = comp.category === "Utilities";
  methodsMap[comp.name] = {
    name: comp.name,
    qualifiedName: isUtility ? comp.name : `Sitecore.${comp.name}`,
    category: comp.category,
    categoryId: catId,
    signature: dts?.signature ?? comp.detail,
    description: dts?.description ?? comp.documentation,
    params: dts?.params ?? [],
    returns: dts?.returns ?? "",
    examples: dts?.examples ?? [],
    snippet: comp.insertText,
    danger: getDangerLevel(comp.name),
  };
}

const categories = Object.values(categoriesMap);

const output = {
  categories,
  methods: methodsMap,
  types,
};

const outPath = path.join(ROOT, "help-data.json");
fs.writeFileSync(outPath, JSON.stringify(output, null, 2));

console.log(`Generated ${outPath}`);
console.log(`  ${Object.keys(methodsMap).length} methods in ${categories.length} categories`);
console.log(`  ${Object.keys(types).length} types`);
