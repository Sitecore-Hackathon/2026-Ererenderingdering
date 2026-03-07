export const MODULE_VERSION = "1.8.3";
export const MODULE_ROOT_PATH = "/sitecore/system/Modules/JavaScript Extensions";
export const TEMPLATES_ROOT_PATH = "/sitecore/templates/Modules/JavaScript Extensions";
export const SCRIPT_LIBRARY_PATH = MODULE_ROOT_PATH + "/Script Library";
export const USER_SCRIPTS_PATH = SCRIPT_LIBRARY_PATH + "/User Scripts";
export const EXAMPLES_PATH = SCRIPT_LIBRARY_PATH + "/Examples";

// Template paths (under TEMPLATES_ROOT_PATH)
export const TEMPLATE_PATHS = {
  jsScriptModule: TEMPLATES_ROOT_PATH + "/JS Script Module",
  jsScriptLibrary: TEMPLATES_ROOT_PATH + "/JS Script Library",
  jsScript: TEMPLATES_ROOT_PATH + "/JS Script",
};

// Icons
export const ICONS = {
  jsScriptModule: "/~/icon/softwarev2/32x32/code_javascript.png",
  jsScriptLibrary: "/~/icon/apps/32x32/Codes.png",
  jsScript: "/~/icon/software/32x32/text_code_javascript.png",
};

export interface TemplateSection {
  name: string;
  fields: { name: string; type: string }[];
}

export interface TemplateDef {
  name: string;
  icon?: string;
  sections: TemplateSection[];
}

export interface ContentItem {
  parent?: string;
  name: string;
  template: string;
  icon?: string;
  fields: Record<string, string>;
  children?: ContentItem[];
}
