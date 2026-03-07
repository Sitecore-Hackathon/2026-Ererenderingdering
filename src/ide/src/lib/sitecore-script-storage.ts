import type { SitecoreHelpers } from "./sitecore-helpers";
import type { ScriptStorageBackend, SavedScript, ScriptTreeNode } from "./script-storage";
import {
  SCRIPT_LIBRARY_PATH,
  USER_SCRIPTS_PATH,
} from "./items";

function itemToScript(item: any): SavedScript {
  const scriptField = item.fields?.nodes?.find((f: any) => f.name === "Script");
  return {
    id: item.itemId,
    name: item.displayName || item.name,
    code: scriptField?.value ?? "",
    lastModified: Date.now(),
  };
}

function isScriptItem(item: any): boolean {
  return item.fields?.nodes?.some((f: any) => f.name === "Script") ?? false;
}

export function createSitecoreScriptStorage(helpers: SitecoreHelpers, jsScriptTemplateId: string): ScriptStorageBackend {
  async function listScriptsFromPath(path: string): Promise<SavedScript[]> {
    const children = await helpers.getItemChildren(path);
    const scripts: SavedScript[] = [];
    for (const child of children) {
      if (isScriptItem(child)) {
        scripts.push(itemToScript(child));
      } else {
        // It's a folder — recurse
        const subPath = `${path}/${child.name}`;
        const subScripts = await listScriptsFromPath(subPath);
        scripts.push(...subScripts);
      }
    }
    return scripts;
  }

  async function buildTree(path: string): Promise<ScriptTreeNode[]> {
    const children = await helpers.getItemChildren(path);
    const nodes: ScriptTreeNode[] = [];
    for (const child of children) {
      const childPath = `${path}/${child.name}`;
      if (isScriptItem(child)) {
        nodes.push({
          id: child.itemId,
          name: child.name,
          displayName: child.displayName || undefined,
          type: "script",
          code: child.fields?.nodes?.find((f: any) => f.name === "Script")?.value ?? "",
          path: childPath,
        });
      } else {
        const subNodes = await buildTree(childPath);
        nodes.push({
          id: child.itemId,
          name: child.name,
          displayName: child.displayName || undefined,
          type: "folder",
          children: subNodes,
          path: childPath,
        });
      }
    }
    return nodes;
  }

  return {
    async listScripts() {
      const [scriptLib, userScripts] = await Promise.all([
        listScriptsFromPath(SCRIPT_LIBRARY_PATH),
        listScriptsFromPath(USER_SCRIPTS_PATH),
      ]);
      return [...scriptLib, ...userScripts];
    },

    async listTree() {
      const [scriptLibChildren, userScriptsChildren] = await Promise.all([
        buildTree(SCRIPT_LIBRARY_PATH),
        buildTree(USER_SCRIPTS_PATH),
      ]);
      return [
        { id: "script-library", name: "Script Library", type: "folder" as const, children: scriptLibChildren },
        { id: "user-scripts", name: "User Scripts", type: "folder" as const, children: userScriptsChildren },
      ];
    },

    async saveScript(name: string, code: string, parentId?: string) {
      let targetParentId: string;
      if (parentId && parentId !== "user-scripts") {
        targetParentId = parentId;
      } else {
        const userScripts = await helpers.getItem(USER_SCRIPTS_PATH);
        if (!userScripts?.itemId) {
          throw new Error("User Scripts folder not found");
        }
        targetParentId = userScripts.itemId;
      }
      const created = await helpers.createItem(
        targetParentId,
        jsScriptTemplateId,
        name,
        { Script: code }
      );
      if (!created?.itemId) {
        throw new Error("Failed to create script item in Sitecore");
      }
      return {
        id: created.itemId,
        name: created.name,
        code,
        lastModified: Date.now(),
        path: created.path,
      };
    },

    async loadScript(id: string) {
      const scripts = await this.listScripts();
      return scripts.find((s: SavedScript) => s.id === id);
    },

    async updateScript(id: string, updates: Partial<Pick<SavedScript, "name" | "code">>) {
      const fields: Record<string, string> = {};
      if (updates.code !== undefined) fields["Script"] = updates.code;
      if (Object.keys(fields).length > 0) {
        await helpers.updateItem(id, fields);
      }
      const scripts = await this.listScripts();
      return scripts.find((s: SavedScript) => s.id === id);
    },

    async deleteScript(id: string) {
      return helpers.deleteItem(id);
    },
  };
}
