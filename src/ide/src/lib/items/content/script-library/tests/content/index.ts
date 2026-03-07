import type { ContentItem } from "../../../../constants";
import { ICONS } from "../../../../constants";
import { getItemTest } from "./get-item";
import { getItemByIdTest } from "./get-item-by-id";
import { getItemChildrenTest } from "./get-item-children";
import { searchTest } from "./search";
import { getMediaItemTest } from "./get-media-item";
import { createItemTest } from "./create-item";
import { updateItemTest } from "./update-item";
import { renameItemTest } from "./rename-item";
import { addItemVersionTest } from "./add-item-version";
import { deleteItemVersionTest } from "./delete-item-version";
import { copyItemTest } from "./copy-item";
import { moveItemTest } from "./move-item";
import { deleteItemTest } from "./delete-item";

export const contentTestsFolder: ContentItem = {
  name: "Content",
  template: "jsScriptLibrary",
  icon: ICONS.jsScriptLibrary,
  fields: {},
  children: [
    getItemTest,
    getItemByIdTest,
    getItemChildrenTest,
    searchTest,
    getMediaItemTest,
    createItemTest,
    updateItemTest,
    renameItemTest,
    addItemVersionTest,
    deleteItemVersionTest,
    copyItemTest,
    moveItemTest,
    deleteItemTest,
  ],
};
