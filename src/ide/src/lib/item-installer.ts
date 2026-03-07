import type { SitecoreHelpers } from "./sitecore-helpers";
import {
  MODULE_VERSION,
  MODULE_ROOT_PATH,
  TEMPLATES_ROOT_PATH,
  TEMPLATE_DEFINITIONS,
  MODULE_DEFINITION,
  type ItemDefinition,
} from "./items/module-definition";

export interface InstallResult {
  installed: boolean;
  version: string;
  storageMode: "sitecore" | "local";
}

async function ensureParentPath(helpers: SitecoreHelpers, path: string): Promise<string | null> {
  const item = await helpers.getItem(path);
  return item?.itemId ?? null;
}

async function createTreeRecursive(
  helpers: SitecoreHelpers,
  parentPath: string,
  parentId: string,
  definition: ItemDefinition
): Promise<void> {
  const itemPath = `${parentPath}/${definition.name}`;
  let itemId: string | null = null;

  // Check if item already exists
  const existing = await helpers.getItem(itemPath);
  if (existing) {
    itemId = existing.itemId;
    // Update fields if they differ
    if (definition.fields && itemId) {
      const existingFields: Record<string, string> = {};
      for (const f of existing.fields?.nodes ?? []) {
        existingFields[f.name] = f.value;
      }
      const needsUpdate = Object.entries(definition.fields).some(
        ([k, v]) => existingFields[k] !== v
      );
      if (needsUpdate) {
        await helpers.updateItem(itemId, itemPath, definition.fields);
      }
    }
  } else {
    // Create the item
    const created = await helpers.createItem(
      parentId,
      definition.name,
      definition.templateId,
      definition.fields
    );
    itemId = created?.itemId ?? null;
  }

  if (!itemId) return;

  // Recurse into children
  if (definition.children) {
    for (const child of definition.children) {
      await createTreeRecursive(helpers, itemPath, itemId, child);
    }
  }
}

async function installTemplates(helpers: SitecoreHelpers): Promise<void> {
  // Ensure templates root folder exists: /sitecore/templates/Modules/JavaScript Extensions
  let templatesRoot = await helpers.getItem(TEMPLATES_ROOT_PATH);
  if (!templatesRoot) {
    // Ensure /sitecore/templates/Modules exists
    const modulesPath = "/sitecore/templates/Modules";
    let modules = await helpers.getItem(modulesPath);
    if (!modules) {
      const templatesFolder = await helpers.getItem("/sitecore/templates");
      if (!templatesFolder) throw new Error("Cannot find /sitecore/templates");
      const created = await helpers.createItem(
        templatesFolder.itemId,
        "Modules",
        "{E269FBB5-3750-427A-9149-7AA950B49301}"
      );
      modules = created;
    }
    // Create "JavaScript Extensions" folder
    const created = await helpers.createItem(
      modules.itemId,
      "JavaScript Extensions",
      "{E269FBB5-3750-427A-9149-7AA950B49301}"
    );
    templatesRoot = created;
  }

  if (!templatesRoot?.itemId) throw new Error("Failed to create templates root");

  // Create each template definition
  for (const tmpl of TEMPLATE_DEFINITIONS) {
    await createTreeRecursive(helpers, TEMPLATES_ROOT_PATH, templatesRoot.itemId, tmpl);
  }
}

async function installContent(helpers: SitecoreHelpers): Promise<void> {
  // Ensure /sitecore/system/Modules exists
  const systemModulesPath = "/sitecore/system/Modules";
  let systemModules = await helpers.getItem(systemModulesPath);
  if (!systemModules) {
    const system = await helpers.getItem("/sitecore/system");
    if (!system) throw new Error("Cannot find /sitecore/system");
    const created = await helpers.createItem(
      system.itemId,
      "Modules",
      "{E269FBB5-3750-427A-9149-7AA950B49301}"
    );
    systemModules = created;
  }

  if (!systemModules?.itemId) throw new Error("Failed to find/create system Modules");

  await createTreeRecursive(helpers, systemModulesPath, systemModules.itemId, MODULE_DEFINITION);
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
      await helpers.updateItem(existing.itemId, MODULE_ROOT_PATH, { Version: MODULE_VERSION });
    }

    return { installed: true, version: MODULE_VERSION, storageMode: "sitecore" };
  } catch (err) {
    console.warn("[JSE] Module installation failed, falling back to localStorage:", err);
    return { installed: false, version: MODULE_VERSION, storageMode: "local" };
  }
}
