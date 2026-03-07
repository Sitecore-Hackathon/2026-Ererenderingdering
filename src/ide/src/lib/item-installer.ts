import type { SitecoreHelpers } from "./sitecore-helpers";
import {
  MODULE_VERSION,
  MODULE_ROOT_PATH,
  TEMPLATES_ROOT_PATH,
  SITECORE_TEMPLATE_ID,
  SITECORE_TEMPLATE_SECTION_ID,
  SITECORE_TEMPLATE_FIELD_ID,
  TEMPLATE_DEFINITIONS,
  MODULE_DEFINITION,
  type ContentItem,
} from "./items";

export interface InstallResult {
  installed: boolean;
  version: string;
  storageMode: "sitecore" | "local";
}

async function createContentRecursive(
  helpers: SitecoreHelpers,
  parentPath: string,
  parentId: string,
  item: ContentItem
): Promise<void> {
  const itemPath = `${parentPath}/${item.name}`;
  let itemId: string | null = null;

  // Check if item already exists
  const existing = await helpers.getItem(itemPath);
  if (existing) {
    itemId = existing.itemId;
    // Update fields if they differ
    const fieldEntries = Object.entries(item.fields);
    if (fieldEntries.length > 0 && itemId) {
      const existingFields: Record<string, string> = {};
      for (const f of existing.fields?.nodes ?? []) {
        existingFields[f.name] = f.value;
      }
      const needsUpdate = fieldEntries.some(
        ([k, v]) => existingFields[k] !== v
      );
      if (needsUpdate) {
        await helpers.updateItem(itemId, item.fields);
      }
    }
  } else {
    // Create the item
    const fieldEntries = Object.entries(item.fields);
    const created = await helpers.createItem(
      parentId,
      item.template,
      item.name,
      fieldEntries.length > 0 ? item.fields : undefined
    );
    itemId = created?.itemId ?? null;
  }

  if (!itemId) return;

  // Recurse into children
  if (item.children) {
    for (const child of item.children) {
      await createContentRecursive(helpers, itemPath, itemId, child);
    }
  }
}

async function ensurePathExists(
  helpers: SitecoreHelpers,
  path: string,
  parentPath: string,
  name: string
): Promise<any> {
  let item = await helpers.getItem(path);
  if (!item) {
    const parent = await helpers.getItem(parentPath);
    if (!parent) throw new Error(`Cannot find ${parentPath}`);
    item = await helpers.createItem(
      parent.itemId,
      SITECORE_TEMPLATE_SECTION_ID,
      name
    );
  }
  return item;
}

async function installTemplates(helpers: SitecoreHelpers): Promise<void> {
  // Ensure templates root folder exists: /sitecore/templates/Modules/JavaScript Extensions
  await ensurePathExists(
    helpers,
    "/sitecore/templates/Modules",
    "/sitecore/templates",
    "Modules"
  );
  const templatesRoot = await ensurePathExists(
    helpers,
    TEMPLATES_ROOT_PATH,
    "/sitecore/templates/Modules",
    "JavaScript Extensions"
  );

  if (!templatesRoot?.itemId) throw new Error("Failed to create templates root");

  // Create each template from its definition
  for (const tmpl of TEMPLATE_DEFINITIONS) {
    const tmplPath = `${tmpl.parent}/${tmpl.name}`;
    let tmplItemId: string;

    const existing = await helpers.getItem(tmplPath);
    if (existing) {
      tmplItemId = existing.itemId;
    } else {
      const parentItem = await helpers.getItem(tmpl.parent);
      if (!parentItem) throw new Error(`Parent not found: ${tmpl.parent}`);
      const created = await helpers.createItem(
        parentItem.itemId,
        SITECORE_TEMPLATE_ID,
        tmpl.name
      );
      tmplItemId = created.itemId;
    }

    // Group field definitions by section, then create section + field children
    const sections = new Map<string, { name: string; type: string }[]>();
    for (const field of tmpl.fields) {
      const group = sections.get(field.section) ?? [];
      group.push({ name: field.name, type: field.type });
      sections.set(field.section, group);
    }

    for (const [sectionName, fields] of sections) {
      const sectionPath = `${tmplPath}/${sectionName}`;
      let sectionItem = await helpers.getItem(sectionPath);
      let sectionId: string;

      if (sectionItem) {
        sectionId = sectionItem.itemId;
      } else {
        const created = await helpers.createItem(
          tmplItemId,
          SITECORE_TEMPLATE_SECTION_ID,
          sectionName
        );
        sectionId = created.itemId;
      }

      for (const field of fields) {
        const fieldPath = `${sectionPath}/${field.name}`;
        const fieldItem = await helpers.getItem(fieldPath);
        if (!fieldItem) {
          await helpers.createItem(
            sectionId,
            SITECORE_TEMPLATE_FIELD_ID,
            field.name,
            { Type: field.type }
          );
        }
      }
    }
  }
}

async function installContent(helpers: SitecoreHelpers): Promise<void> {
  if (!MODULE_DEFINITION.parent) {
    throw new Error("Root content item must have a parent path");
  }

  // Ensure parent exists (e.g. /sitecore/system/Modules)
  const parentSegments = MODULE_DEFINITION.parent.split("/");
  const parentName = parentSegments.pop()!;
  const grandParentPath = parentSegments.join("/");

  const systemModules = await ensurePathExists(
    helpers,
    MODULE_DEFINITION.parent,
    grandParentPath,
    parentName
  );

  if (!systemModules?.itemId) throw new Error("Failed to find/create system Modules");

  await createContentRecursive(
    helpers,
    MODULE_DEFINITION.parent,
    systemModules.itemId,
    MODULE_DEFINITION
  );
}

function compareVersions(a: string, b: string): number {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const na = pa[i] ?? 0;
    const nb = pb[i] ?? 0;
    if (na !== nb) return na - nb;
  }
  return 0;
}

export async function installModule(helpers: SitecoreHelpers): Promise<InstallResult> {
  try {
    const existing = await helpers.getItem(MODULE_ROOT_PATH);

    if (!existing) {
      // Full install
      await installTemplates(helpers);
      await installContent(helpers);
      return { installed: true, version: MODULE_VERSION, storageMode: "sitecore" };
    }

    // Check version
    const installedVersion =
      existing.fields?.nodes?.find((f: any) => f.name === "Version")?.value ?? "0.0.0";

    if (compareVersions(MODULE_VERSION, installedVersion) > 0) {
      // Upgrade: re-walk definition tree to create missing / update changed items
      await installTemplates(helpers);
      await installContent(helpers);
      // Update version
      await helpers.updateItem(existing.itemId, { Version: MODULE_VERSION });
    }

    return { installed: true, version: MODULE_VERSION, storageMode: "sitecore" };
  } catch (err) {
    console.warn("[JSE] Module installation failed, falling back to localStorage:", err);
    return { installed: false, version: MODULE_VERSION, storageMode: "local" };
  }
}
