import type { ContentItem } from "../../../../constants";
import { ICONS } from "../../../../constants";
import { getLanguagesTest } from "./get-languages";
import { getSupportedLanguagesTest } from "./get-supported-languages";
import { getLanguageTest } from "./get-language";
import { getFallbackLanguageTest } from "./get-fallback-language";
import { getArchivedItemsTest } from "./get-archived-items";
import { addLanguageTest } from "./add-language";
import { deleteLanguagesTest } from "./delete-languages";
import { archiveItemTest } from "./archive-item";
import { archiveVersionTest } from "./archive-version";
import { setItemArchiveDateTest } from "./set-item-archive-date";
import { setVersionArchiveDateTest } from "./set-version-archive-date";
import { getArchivedItemTest } from "./get-archived-item";
import { deleteArchivedItemTest } from "./delete-archived-item";
import { deleteArchivedVersionTest } from "./delete-archived-version";
import { emptyArchiveTest } from "./empty-archive";

export const languagesTestsFolder: ContentItem = {
  name: "Languages",
  template: "jsScriptLibrary",
  icon: ICONS.jsScriptLibrary,
  fields: {},
  children: [
    getLanguagesTest,
    getSupportedLanguagesTest,
    getLanguageTest,
    getFallbackLanguageTest,
    getArchivedItemsTest,
    addLanguageTest,
    deleteLanguagesTest,
    archiveItemTest,
    archiveVersionTest,
    setItemArchiveDateTest,
    setVersionArchiveDateTest,
    getArchivedItemTest,
    deleteArchivedItemTest,
    deleteArchivedVersionTest,
    emptyArchiveTest,
  ],
};
