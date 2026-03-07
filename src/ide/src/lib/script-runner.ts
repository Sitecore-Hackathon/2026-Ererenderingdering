import type { SitecoreHelpers } from "./sitecore-helpers";
import helpData from "./help-data.json";

export interface ConsoleEntry {
  level: "log" | "warn" | "error" | "info";
  args: any[];
  timestamp: number;
}

export interface ScriptResult {
  consoleOutput: ConsoleEntry[];
  htmlOutput: string | null;
  returnValue: any;
  error: Error | null;
  duration: number;
}

export async function runScript(
  code: string,
  sitecoreHelpers: SitecoreHelpers
): Promise<ScriptResult> {
  const consoleOutput: ConsoleEntry[] = [];
  let htmlOutput: string | null = null;

  function print(...args: any[]) {
    consoleOutput.push({
      level: "log",
      args: args.map(serializeArg),
      timestamp: Date.now(),
    });
  }

  function render(html: string) {
    htmlOutput = html;
  }

  function help(query?: string) {
    const methods = helpData.methods as Record<string, any>;
    const categories = helpData.categories as Array<{ id: string; name: string; methods: string[] }>;

    if (!query) {
      // Overview: list all categories with method counts
      const lines = ["Sitecore Scripting Console - API Reference", "=".repeat(48), ""];
      for (const cat of categories) {
        lines.push(`${cat.name} (${cat.methods.length} methods)`);
        lines.push(`  ${cat.methods.join(", ")}`);
        lines.push("");
      }
      lines.push('Type help("methodName") for details on a specific method.');
      lines.push('Type help("category") for all methods in a category.');
      print(lines.join("\n"));
      return;
    }

    const q = query.toLowerCase();

    // Check if it matches a method name
    const method = Object.values(methods).find(
      (m: any) => m.name.toLowerCase() === q || m.qualifiedName.toLowerCase() === q
    ) as any;

    if (method) {
      const lines = [
        method.qualifiedName,
        "-".repeat(40),
        method.description,
        "",
        `Signature: ${method.signature}`,
      ];
      if (method.params.length > 0) {
        lines.push("", "Parameters:");
        for (const p of method.params) {
          lines.push(`  ${p.name}${p.optional ? "?" : ""}: ${p.type}${p.description ? " - " + p.description : ""}`);
        }
      }
      lines.push("", `Returns: ${method.returns}`);
      lines.push(`Danger: ${method.danger}`);
      if (method.examples.length > 0) {
        lines.push("", "Example:");
        for (const ex of method.examples) {
          lines.push("  " + ex.split("\n").join("\n  "));
        }
      }
      print(lines.join("\n"));
      return;
    }

    // Check if it matches a category
    const cat = categories.find(
      (c) => c.name.toLowerCase() === q || c.id === q
    );
    if (cat) {
      const lines = [`${cat.name} - ${cat.methods.length} methods`, "=".repeat(40), ""];
      for (const name of cat.methods) {
        const m = methods[name];
        if (m) {
          lines.push(`  ${m.qualifiedName}`);
          lines.push(`    ${m.description}`);
        }
      }
      print(lines.join("\n"));
      return;
    }

    // Fuzzy search across method names and descriptions
    const matches = Object.values(methods).filter(
      (m: any) => m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q)
    ) as any[];

    if (matches.length > 0) {
      const lines = [`Search results for "${query}" (${matches.length} matches):`, ""];
      for (const m of matches) {
        lines.push(`  ${m.qualifiedName} - ${m.description}`);
      }
      print(lines.join("\n"));
    } else {
      print(`No help found for "${query}". Type help() for an overview.`);
    }
  }

  const originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error,
    info: console.info,
  };

  const proxyConsole: Record<string, (...args: any[]) => void> = {};
  for (const level of ["log", "warn", "error", "info"] as const) {
    proxyConsole[level] = (...args: any[]) => {
      consoleOutput.push({
        level,
        args: args.map(serializeArg),
        timestamp: Date.now(),
      });
      originalConsole[level](...args);
    };
  }

  const start = performance.now();
  let returnValue: any = undefined;
  let error: Error | null = null;

  try {
    // Build namespace-grouped wrapper on top of flat helpers
    const namespaceMap: Record<string, string[]> = {
      Content: ["getItem", "getItemChildren", "getMediaItem", "search", "createItem", "createItemFromBranch", "updateItem", "deleteItem", "renameItem", "moveItem", "copyItem", "addItemVersion", "deleteItemVersion", "uploadMedia"],
      Publishing: ["getPublishingStatus", "getPublishingTargets", "getPublishingQueue", "publishItem", "publishLanguageSpecificItems", "publishSite", "publishWithOptions", "cancelPublishing"],
      Indexes: ["getIndex", "getIndexes", "rebuildIndexes", "populateManagedSchema", "rebuildLinkDatabase", "cleanUpDatabases"],
      Workflows: ["getWorkflow", "getWorkflows", "getJob", "getJobs", "isJobQueued", "isJobRunning", "startWorkflow", "executeWorkflowCommand"],
      Translation: ["translatePage", "translateSite"],
      Templates: ["getTemplate", "getTemplates", "getDataSourceTemplates", "getTenantTemplates", "createTemplate", "updateTemplate", "deleteTemplate", "createTemplateFolder"],
      Sites: ["getSite", "getSites", "getSiteCollections", "getSolutionSites", "searchSolutionSites", "getSolutionTemplates", "scaffoldSolution", "createSite", "createSiteCollection", "removeSite", "removeSiteCollection", "renameSite", "renameSiteCollection", "cloneSite", "updateSitesPos"],
      Languages: ["getLanguage", "getLanguages", "getSupportedLanguages", "getFallbackLanguage", "getArchivedItem", "getArchivedItems", "addLanguage", "deleteLanguage", "deleteLanguages", "archiveItem", "archiveVersion", "setItemArchiveDate", "setVersionArchiveDate", "restoreArchivedItem", "restoreArchivedVersion", "deleteArchivedItem", "deleteArchivedVersion", "emptyArchive"],
      Security: ["getCurrentUser", "getUser", "getUsers", "getRole", "getRoles", "getDomain", "getDomains", "getSelectionProfiles", "createUser", "updateUser", "deleteUser", "unlockUser", "enableUser", "disableUser", "resetUserSettings", "changeUserPassword", "createDomain", "deleteDomain", "createRole", "deleteRole", "addRoleToRoles", "deleteRoleFromRoles", "addAccountsToRole", "deleteAccountsFromRole"],
      Presentation: ["getAvailableRenderings", "getPageDesigns", "getPartialDesigns", "getPageBranchesRoots", "getDatabases", "getMeta", "configurePageDesigns"],
    };

    const namespaces: Record<string, Record<string, any>> = {};
    for (const [ns, methods] of Object.entries(namespaceMap)) {
      const obj: Record<string, any> = {};
      for (const m of methods) {
        if (typeof (sitecoreHelpers as any)[m] === "function") {
          obj[m] = (sitecoreHelpers as any)[m].bind(sitecoreHelpers);
        }
      }
      namespaces[ns] = obj;
    }

    const sitecoreWithNamespaces = Object.assign({}, sitecoreHelpers, namespaces);

    // AsyncFunction allows top-level await
    const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
    const fn = new AsyncFunction(
      "Sitecore",
      "sc",
      "print",
      "render",
      "console",
      "help",
      code
    );
    returnValue = await fn(sitecoreWithNamespaces, sitecoreWithNamespaces, print, render, proxyConsole, help);
  } catch (e) {
    error = e instanceof Error ? e : new Error(String(e));
    consoleOutput.push({
      level: "error",
      args: [error.message],
      timestamp: Date.now(),
    });
  }

  const duration = performance.now() - start;

  return { consoleOutput, htmlOutput, returnValue, error, duration };
}

function serializeArg(arg: any): string {
  if (arg === undefined) return "undefined";
  if (arg === null) return "null";
  if (typeof arg === "string") return arg;
  try {
    return JSON.stringify(arg, null, 2);
  } catch {
    return String(arg);
  }
}
