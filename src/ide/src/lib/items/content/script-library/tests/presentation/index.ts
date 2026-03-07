import type { ContentItem } from "../../../../constants";
import { ICONS } from "../../../../constants";
import { getDatabasesTest } from "./get-databases";
import { getMetaTest } from "./get-meta";
import { getAvailableRenderingsTest } from "./get-available-renderings";
import { getPageDesignsTest } from "./get-page-designs";
import { getPartialDesignsTest } from "./get-partial-designs";
import { getPageBranchesRootsTest } from "./get-page-branches-roots";
import { configurePageDesignsTest } from "./configure-page-designs";

export const presentationTestsFolder: ContentItem = {
  name: "Presentation",
  template: "jsScriptLibrary",
  icon: ICONS.jsScriptLibrary,
  fields: {},
  children: [
    getDatabasesTest,
    getMetaTest,
    getAvailableRenderingsTest,
    getPageDesignsTest,
    getPartialDesignsTest,
    getPageBranchesRootsTest,
    configurePageDesignsTest,
  ],
};
