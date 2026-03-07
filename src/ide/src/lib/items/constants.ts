export const MODULE_VERSION = "1.0.0";
export const MODULE_ROOT_PATH = "/sitecore/system/Modules/JavaScript Extensions";
export const TEMPLATES_ROOT_PATH = "/sitecore/templates/Modules/JavaScript Extensions";
export const SCRIPT_LIBRARY_PATH = MODULE_ROOT_PATH + "/Script Library";
export const USER_SCRIPTS_PATH = SCRIPT_LIBRARY_PATH + "/User Scripts";
export const EXAMPLES_PATH = SCRIPT_LIBRARY_PATH + "/Examples";

// Well-known Sitecore meta-template IDs
export const SITECORE_TEMPLATE_ID = "{AB86861A-6030-46C5-B394-E8F99E8B87DB}";
export const SITECORE_TEMPLATE_SECTION_ID = "{E269FBB5-3750-427A-9149-7AA950B49301}";
export const SITECORE_TEMPLATE_FIELD_ID = "{455A3E98-A627-4B40-8035-E683A0331AC7}";

// Custom template IDs (stable GUIDs for our module)
export const TEMPLATE_IDS = {
  jsScriptModule: "{7A4D6B2E-1F3C-4A8D-9E5B-2C6F8D3A1E4B}",
  jsScriptLibrary: "{3B8E5C1D-4F2A-4D7E-8A6C-9D1F3E5B7C2A}",
  jsScript: "{5C2A8D4E-6B3F-4E1A-9D7C-8F2E4A6B1D3C}",
};

export interface TemplateFieldDef {
  section: string;
  name: string;
  type: string;
}

export interface TemplateItem {
  parent: string;
  name: string;
  id: string;
  icon?: string;
  fields: TemplateFieldDef[];
}

export interface ContentItem {
  parent?: string;
  name: string;
  template: string;
  icon?: string;
  fields: Record<string, string>;
  children?: ContentItem[];
}
