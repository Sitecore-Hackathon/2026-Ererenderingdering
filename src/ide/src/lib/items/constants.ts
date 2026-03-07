export const MODULE_VERSION = "1.9.7";
export const MODULE_ROOT_PATH = "/sitecore/system/Modules/JavaScript Extensions";
export const TEMPLATES_ROOT_PATH = "/sitecore/templates/Modules/JavaScript Extensions";
export const SCRIPT_LIBRARY_PATH = MODULE_ROOT_PATH + "/Script Library";
export const USER_SCRIPTS_PATH = SCRIPT_LIBRARY_PATH + "/User Scripts";
export const EXAMPLES_PATH = SCRIPT_LIBRARY_PATH + "/Examples";
export const TESTS_PATH = SCRIPT_LIBRARY_PATH + "/Tests";

// Template paths (under TEMPLATES_ROOT_PATH)
export const TEMPLATE_PATHS = {
  jsScriptModule: TEMPLATES_ROOT_PATH + "/JS Script Module",
  jsScriptLibrary: TEMPLATES_ROOT_PATH + "/JS Script Library",
  jsScript: TEMPLATES_ROOT_PATH + "/JS Script",
};

// Icons
export const ICONS = {
  jsScriptModule: "/~/icon/software/32x32/text_code_javascript.png",
  jsScriptLibrary: "/~/icon/apps/32x32/Codes.png",
  jsScript: "/~/icon/softwarev2/32x32/code_javascript.png",
};

export interface TemplateSection {
  name: string;
  fields: { name: string; type: string }[];
}

export interface TemplateDef {
  name: string;
  icon?: string;
  sections: TemplateSection[];
  standardValues?: Record<string, string>;
}

export interface ContentItem {
  parent?: string;
  name: string;
  template: string;
  icon?: string;
  fields: Record<string, string>;
  children?: ContentItem[];
}
