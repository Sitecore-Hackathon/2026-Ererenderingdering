import type { ContentItem } from "../../../../constants";
import { ICONS } from "../../../../constants";
import { getIndexesTest } from "./get-indexes";
import { getIndexTest } from "./get-index";
import { rebuildIndexesTest } from "./rebuild-indexes";
import { populateManagedSchemaTest } from "./populate-managed-schema";
import { rebuildLinkDatabaseTest } from "./rebuild-link-database";
import { cleanUpDatabasesTest } from "./clean-up-databases";

export const indexesTestsFolder: ContentItem = {
  name: "Indexes",
  template: "jsScriptLibrary",
  icon: ICONS.jsScriptLibrary,
  fields: {},
  children: [
    getIndexesTest,
    getIndexTest,
    rebuildIndexesTest,
    populateManagedSchemaTest,
    rebuildLinkDatabaseTest,
    cleanUpDatabasesTest,
  ],
};
