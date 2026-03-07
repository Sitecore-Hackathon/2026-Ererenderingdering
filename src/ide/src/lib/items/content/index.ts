import type { ContentItem } from "../constants";
import { TEMPLATE_IDS, MODULE_VERSION } from "../constants";
import { scriptLibraryFolder } from "./script-library";

export const javascriptExtensions: ContentItem = {
  parent: "/sitecore/system/Modules",
  name: "JavaScript Extensions",
  template: TEMPLATE_IDS.jsScriptModule,
  fields: { Version: MODULE_VERSION },
  children: [scriptLibraryFolder],
};

export { javascriptExtensions as MODULE_DEFINITION };
