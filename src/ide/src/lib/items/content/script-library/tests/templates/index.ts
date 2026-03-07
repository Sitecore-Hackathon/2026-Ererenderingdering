import type { ContentItem } from "../../../../constants";
import { ICONS } from "../../../../constants";
import { getTemplatesTest } from "./get-templates";
import { getDataSourceTemplatesTest } from "./get-data-source-templates";
import { getTenantTemplatesTest } from "./get-tenant-templates";
import { createTemplateFolderTest } from "./create-template-folder";
import { createTemplateTest } from "./create-template";
import { getTemplateTest } from "./get-template";
import { updateTemplateTest } from "./update-template";

export const templatesTestsFolder: ContentItem = {
  name: "Templates",
  template: "jsScriptLibrary",
  icon: ICONS.jsScriptLibrary,
  fields: {},
  children: [
    getTemplatesTest,
    getDataSourceTemplatesTest,
    getTenantTemplatesTest,
    createTemplateFolderTest,
    createTemplateTest,
    getTemplateTest,
    updateTemplateTest,
  ],
};
