import type { ContentItem } from "../../../../constants";
import { ICONS } from "../../../../constants";
import { getPublishingTargetsTest } from "./get-publishing-targets";
import { getPublishingQueueTest } from "./get-publishing-queue";
import { publishItemTest } from "./publish-item";
import { getPublishingStatusTest } from "./get-publishing-status";
import { cancelPublishingTest } from "./cancel-publishing";
import { publishSiteTest } from "./publish-site";
import { publishWithOptionsTest } from "./publish-with-options";
import { publishLanguageSpecificTest } from "./publish-language-specific";

export const publishingTestsFolder: ContentItem = {
  name: "Publishing",
  template: "jsScriptLibrary",
  icon: ICONS.jsScriptLibrary,
  fields: {},
  children: [
    getPublishingTargetsTest,
    getPublishingQueueTest,
    publishItemTest,
    getPublishingStatusTest,
    cancelPublishingTest,
    publishSiteTest,
    publishWithOptionsTest,
    publishLanguageSpecificTest,
  ],
};
