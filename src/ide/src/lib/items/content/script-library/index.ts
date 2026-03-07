import type { ContentItem } from "../../constants";
import { TEMPLATE_IDS } from "../../constants";
import { examplesFolder } from "./examples";
import { userScriptsFolder } from "./user-scripts";

export const scriptLibraryFolder: ContentItem = {
  name: "Script Library",
  template: TEMPLATE_IDS.jsScriptLibrary,
  fields: {},
  children: [examplesFolder, userScriptsFolder],
};
