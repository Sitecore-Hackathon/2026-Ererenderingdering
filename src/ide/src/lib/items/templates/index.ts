import type { TemplateItem } from "../constants";
import { jsScriptModuleTemplate } from "./js-script-module";
import { jsScriptLibraryTemplate } from "./js-script-library";
import { jsScriptTemplate } from "./js-script";

export const TEMPLATE_DEFINITIONS: TemplateItem[] = [
  jsScriptModuleTemplate,
  jsScriptLibraryTemplate,
  jsScriptTemplate,
];
