import type { TemplateItem } from "../constants";
import { TEMPLATES_ROOT_PATH, TEMPLATE_IDS } from "../constants";

export const jsScriptModuleTemplate: TemplateItem = {
  parent: TEMPLATES_ROOT_PATH,
  name: "JS Script Module",
  id: TEMPLATE_IDS.jsScriptModule,
  fields: [
    { section: "Settings", name: "Version", type: "Single-Line Text" },
  ],
};
