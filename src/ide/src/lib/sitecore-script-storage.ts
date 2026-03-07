import type { SitecoreHelpers } from "./sitecore-helpers";
import type { ScriptStorageBackend, SavedScript } from "./script-storage";
import {
  EXAMPLES_PATH,
  USER_SCRIPTS_PATH,
  TEMPLATE_IDS,
} from "./items/module-definition";

function itemToScript(item: any): SavedScript {
  const scriptField = item.fields?.nodes?.find((f: any) => f.name === "Script");
  return {
    id: item.itemId,
    name: item.name,
    code: scriptField?.value ?? "",
    lastModified: Date.now(),
  };
}

export function createSitecoreScriptStorage(helpers: SitecoreHelpers): ScriptStorageBackend {
  return {
    async listScripts() {
      const [examples, userScripts] = await Promise.all([
        helpers.getItemChildren(EXAMPLES_PATH),
        helpers.getItemChildren(USER_SCRIPTS_PATH),
      ]);
      return [...examples, ...userScripts].map(itemToScript);
    },

    async saveScript(name: string, code: string) {
      const userScripts = await helpers.getItem(USER_SCRIPTS_PATH);
      if (!userScripts?.itemId) {
        throw new Error("User Scripts folder not found");
      }
      const created = await helpers.createItem(
        userScripts.itemId,
        name,
        TEMPLATE_IDS.jsScript,
        { Script: code }
      );
      return {
        id: created.itemId,
        name: created.name,
        code,
        lastModified: Date.now(),
      };
    },

    async loadScript(id: string) {
      // Search in both paths
      const scripts = await this.listScripts();
      return scripts.find((s) => s.id === id);
    },

    async updateScript(id: string, updates: Partial<Pick<SavedScript, "name" | "code">>) {
      const fields: Record<string, string> = {};
      if (updates.code !== undefined) fields["Script"] = updates.code;
      // Sitecore item rename is not straightforward via GraphQL, so we only update fields
      if (Object.keys(fields).length > 0) {
        await helpers.updateItem(id, "", fields);
      }
      // Return updated script
      const scripts = await this.listScripts();
      return scripts.find((s) => s.id === id);
    },

    async deleteScript(id: string) {
      return helpers.deleteItem(id);
    },
  };
}
