import type { ContentItem } from "../../../../constants";
import { ICONS } from "../../../../constants";
import { getContextTest } from "./get-context";
import { graphqlTest } from "./graphql";
import { listSitesTest } from "./list-sites";

export const coreTestsFolder: ContentItem = {
  name: "Core",
  template: "jsScriptLibrary",
  icon: ICONS.jsScriptLibrary,
  fields: {},
  children: [getContextTest, graphqlTest, listSitesTest],
};
