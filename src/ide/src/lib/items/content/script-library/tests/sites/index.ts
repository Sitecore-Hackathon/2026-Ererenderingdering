import type { ContentItem } from "../../../../constants";
import { ICONS } from "../../../../constants";
import { getSitesTest } from "./get-sites";
import { getSiteTest } from "./get-site";
import { getSiteCollectionsTest } from "./get-site-collections";
import { getSolutionSitesTest } from "./get-solution-sites";
import { searchSolutionSitesTest } from "./search-solution-sites";
import { getSolutionTemplatesTest } from "./get-solution-templates";

export const sitesTestsFolder: ContentItem = {
  name: "Sites",
  template: "jsScriptLibrary",
  icon: ICONS.jsScriptLibrary,
  fields: {},
  children: [
    getSitesTest,
    getSiteTest,
    getSiteCollectionsTest,
    getSolutionSitesTest,
    searchSolutionSitesTest,
    getSolutionTemplatesTest,
  ],
};
