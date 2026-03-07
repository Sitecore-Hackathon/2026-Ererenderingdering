import type { SitecoreHelpers } from "./sitecore-helpers";
import type { ContentItem } from "./items";
import {
  MODULE_VERSION,
  MODULE_ROOT_PATH,
  SCRIPT_LIBRARY_PATH,
  USER_SCRIPTS_PATH,
  EXAMPLES_PATH,
  TESTS_PATH,
  TEMPLATES_ROOT_PATH,
  ICONS,
  TEMPLATE_DEFINITIONS,
} from "./items";
import { scriptLibraryFolder } from "./items/content/script-library";
import { examplesFolder } from "./items/content/script-library/examples";
import { testsFolder } from "./items/content/script-library/tests";

export interface InstallResult {
  installed: boolean;
  version: string;
  storageMode: "sitecore" | "local";
  templateIds?: ResolvedTemplateIds;
}

export interface ResolvedTemplateIds {
  jsScriptModule: string;
  jsScriptLibrary: string;
  jsScript: string;
}

async function ensureTemplateFolder(helpers: SitecoreHelpers): Promise<string> {
  const existing = await helpers.getItem(TEMPLATES_ROOT_PATH);
  if (existing?.itemId) return existing.itemId;

  const modulesPath = "/sitecore/templates/Modules";
  let modules = await helpers.getItem(modulesPath);
  if (!modules) {
    const templates = await helpers.getItem("/sitecore/templates");
    if (!templates?.itemId) throw new Error("Cannot find /sitecore/templates");
    console.log("[JSE] Creating /sitecore/templates/Modules");
    modules = await helpers.createTemplateFolder(templates.itemId, "Modules");
  }
  if (!modules?.itemId) throw new Error("Failed to create /sitecore/templates/Modules");

  console.log("[JSE] Creating template folder: JavaScript Extensions");
  const folder = await helpers.createTemplateFolder(modules.itemId, "JavaScript Extensions");
  if (!folder?.itemId) throw new Error("Failed to create JavaScript Extensions template folder");
  return folder.itemId;
}

// Template name -> key mapping
const TEMPLATE_KEY_MAP: Record<string, keyof ResolvedTemplateIds> = {
  "JS Script Module": "jsScriptModule",
  "JS Script Library": "jsScriptLibrary",
  "JS Script": "jsScript",
};

async function installTemplates(helpers: SitecoreHelpers): Promise<ResolvedTemplateIds> {
  const folderId = await ensureTemplateFolder(helpers);
  const ids: Partial<ResolvedTemplateIds> = {};

  for (const tmpl of TEMPLATE_DEFINITIONS) {
    const key = TEMPLATE_KEY_MAP[tmpl.name];
    if (!key) continue;

    const tmplItemPath = `${TEMPLATES_ROOT_PATH}/${tmpl.name}`;
    const existingItem = await helpers.getItem(tmplItemPath);

    if (existingItem?.itemId) {
      console.log(`[JSE] Template already exists: ${tmpl.name} (${existingItem.itemId})`);
      ids[key] = existingItem.itemId;
    } else {
      console.log(`[JSE] Creating template: ${tmpl.name}`);
      const opts: any = {};
      if (tmpl.sections && tmpl.sections.length > 0) {
        opts.sections = tmpl.sections;
      }
      if (tmpl.icon) {
        opts.icon = tmpl.icon;
      }
      if (tmpl.standardValues) {
        opts.createStandardValuesItem = true;
      }
      const created = await helpers.createTemplate(folderId, tmpl.name, opts);
      if (!created?.templateId) throw new Error(`Failed to create template: ${tmpl.name}`);
      console.log(`[JSE] Created template: ${tmpl.name} (${created.templateId})`);
      ids[key] = created.templateId;

      // Set standard values fields (e.g. __Icon)
      if (tmpl.standardValues) {
        const stdValPath = `${TEMPLATES_ROOT_PATH}/${tmpl.name}/__Standard Values`;
        const stdVal = await helpers.getItem(stdValPath);
        if (stdVal?.itemId) {
          console.log(`[JSE] Setting standard values for: ${tmpl.name}`);
          await helpers.updateItem(stdVal.itemId, tmpl.standardValues);
        }
      }
    }
  }

  if (!ids.jsScriptModule || !ids.jsScriptLibrary || !ids.jsScript) {
    throw new Error("Failed to resolve all template IDs");
  }

  return ids as ResolvedTemplateIds;
}

/** Delete only managed subfolders (Examples, Tests) — preserves User Scripts */
async function deleteManagedFolders(helpers: SitecoreHelpers): Promise<void> {
  const managedPaths = [EXAMPLES_PATH, TESTS_PATH];
  for (const path of managedPaths) {
    const item = await helpers.getItem(path);
    if (item?.itemId) {
      console.log(`[JSE] Deleting managed folder: ${path} (${item.itemId})`);
      try {
        await withRetry(() => helpers.deleteItem(item.itemId), `delete ${path}`);
      } catch (err) {
        console.error(`[JSE] Failed to delete ${path}, skipping reinstall of this folder`);
        throw err;
      }
      // Verify deletion
      const check = await helpers.getItem(path);
      if (check?.itemId) {
        console.error(`[JSE] Folder ${path} still exists after delete, aborting upgrade for this folder`);
        throw new Error(`Failed to delete ${path}`);
      }
      console.log(`[JSE] Successfully deleted: ${path}`);
    }
  }
}

async function installModuleRoot(helpers: SitecoreHelpers, templateIds: ResolvedTemplateIds): Promise<string> {
  const systemModulesPath = "/sitecore/system/Modules";
  let systemModules = await helpers.getItem(systemModulesPath);
  if (!systemModules) {
    const system = await helpers.getItem("/sitecore/system");
    if (!system?.itemId) throw new Error("Cannot find /sitecore/system");
    console.log("[JSE] Creating /sitecore/system/Modules");
    systemModules = await helpers.createItem(
      system.itemId,
      "{E269FBB5-3750-427A-9149-7AA950B49301}",
      "Modules"
    );
  }
  if (!systemModules?.itemId) throw new Error("Failed to find/create system Modules");

  console.log("[JSE] Creating module root: JavaScript Extensions");
  const moduleRoot = await helpers.createItem(
    systemModules.itemId,
    templateIds.jsScriptModule,
    "JavaScript Extensions",
    { Version: MODULE_VERSION, __Icon: ICONS.jsScriptModule }
  );
  if (!moduleRoot?.itemId) throw new Error("Failed to create module root");
  return moduleRoot.itemId;
}

const RETRY_DELAYS = [500, 1500, 3000];

async function withRetry<T>(fn: () => Promise<T>, label: string): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      const msg = err?.message || String(err);
      if (attempt < RETRY_DELAYS.length) {
        const delay = RETRY_DELAYS[attempt];
        console.warn(`[JSE] "${label}" failed: ${msg}. Retrying in ${delay}ms (attempt ${attempt + 1}/${RETRY_DELAYS.length})...`);
        await new Promise((r) => setTimeout(r, delay));
      } else {
        console.error(`[JSE] "${label}" failed after ${RETRY_DELAYS.length} retries: ${msg}`);
        throw err;
      }
    }
  }
}

async function installContentTree(
  helpers: SitecoreHelpers,
  parentId: string,
  item: ContentItem,
  templateIds: ResolvedTemplateIds
): Promise<void> {
  const templateId = templateIds[item.template as keyof ResolvedTemplateIds];
  if (!templateId) {
    console.warn(`[JSE] Unknown template "${item.template}" for item "${item.name}", skipping`);
    return;
  }

  const fields: Record<string, string> = { ...item.fields };
  if (item.icon) fields.__Icon = item.icon;

  console.log(`[JSE] Creating item: ${item.name} (template=${item.template})`);
  let created;
  try {
    created = await withRetry(
      () => helpers.createItem(parentId, templateId, item.name, fields),
      item.name
    );
  } catch (err) {
    console.error(`[JSE] Error creating item "${item.name}":`, err);
    return;
  }
  if (!created?.itemId) {
    console.warn(`[JSE] Failed to create item: ${item.name}`);
    return;
  }

  if (item.children) {
    for (const child of item.children) {
      try {
        await installContentTree(helpers, created.itemId, child, templateIds);
      } catch (err) {
        console.error(`[JSE] Error installing child "${child.name}" under "${item.name}":`, err);
      }
    }
  }
}

async function installScriptLibrary(
  helpers: SitecoreHelpers,
  moduleRootId: string,
  templateIds: ResolvedTemplateIds
): Promise<void> {
  await installContentTree(helpers, moduleRootId, scriptLibraryFolder, templateIds);
}

async function ensureUserScripts(
  helpers: SitecoreHelpers,
  moduleRootId: string,
  templateIds: ResolvedTemplateIds
): Promise<void> {
  const existing = await helpers.getItem(USER_SCRIPTS_PATH);
  if (existing) return;
  console.log("[JSE] Creating User Scripts folder");
  const scriptLib = await helpers.getItem(SCRIPT_LIBRARY_PATH);
  if (!scriptLib?.itemId) return;
  await helpers.createItem(
    scriptLib.itemId,
    templateIds.jsScriptLibrary,
    "User Scripts",
    { __Icon: ICONS.jsScriptLibrary }
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
    console.log("[JSE] Starting module installation, version:", MODULE_VERSION);

    // Step 1: Ensure templates exist and get their real IDs
    const templateIds = await installTemplates(helpers);

    // Step 2: Check module root
    const existing = await helpers.getItem(MODULE_ROOT_PATH);

    if (!existing) {
      console.log("[JSE] Fresh install - creating module tree");
      const moduleRootId = await installModuleRoot(helpers, templateIds);
      await installScriptLibrary(helpers, moduleRootId, templateIds);
      await ensureUserScripts(helpers, moduleRootId, templateIds);
      console.log("[JSE] Installation complete");
      return { installed: true, version: MODULE_VERSION, storageMode: "sitecore", templateIds };
    }

    // Step 3: Check version
    const installedVersion =
      existing.fields?.nodes?.find((f: any) => f.name === "Version")?.value ?? "0.0.0";
    console.log("[JSE] Installed version:", installedVersion, "Current:", MODULE_VERSION);

    if (compareVersions(MODULE_VERSION, installedVersion) > 0) {
      console.log("[JSE] Upgrading module from", installedVersion, "to", MODULE_VERSION);

      // Ensure Script Library folder exists
      let scriptLib = await helpers.getItem(SCRIPT_LIBRARY_PATH);
      if (!scriptLib?.itemId) {
        console.log("[JSE] Script Library missing, recreating full tree");
        await installScriptLibrary(helpers, existing.itemId, templateIds);
        await ensureUserScripts(helpers, existing.itemId, templateIds);
      } else {
        // Only delete and reinstall managed folders (Examples, Tests)
        // User Scripts folder is preserved
        console.log("[JSE] Deleting managed folders for upgrade...");
        await deleteManagedFolders(helpers);
        console.log("[JSE] Reinstalling Examples folder...");
        await installContentTree(helpers, scriptLib.itemId, examplesFolder, templateIds);
        console.log("[JSE] Reinstalling Tests folder...");
        await installContentTree(helpers, scriptLib.itemId, testsFolder, templateIds);
        await ensureUserScripts(helpers, existing.itemId, templateIds);
      }

      await helpers.updateItem(existing.itemId, { Version: MODULE_VERSION });
      console.log("[JSE] Upgrade complete");
    } else {
      console.log("[JSE] Module up to date, skipping");
    }

    return { installed: true, version: MODULE_VERSION, storageMode: "sitecore", templateIds };
  } catch (err) {
    console.error("[JSE] Module installation failed, falling back to localStorage:", err);
    return { installed: false, version: MODULE_VERSION, storageMode: "local" };
  }
}
