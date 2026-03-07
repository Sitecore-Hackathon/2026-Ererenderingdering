import type { ContentItem } from "../../../constants";
import { ICONS } from "../../../constants";
import { apiTestSuiteScript } from "./api-test-suite";
import { coreTestsFolder } from "./core";
import { contentTestsFolder } from "./content";
import { templatesTestsFolder } from "./templates";
import { sitesTestsFolder } from "./sites";
import { indexesTestsFolder } from "./indexes";
import { workflowsTestsFolder } from "./workflows";
import { languagesTestsFolder } from "./languages";
import { securityTestsFolder } from "./security";
import { publishingTestsFolder } from "./publishing";
import { presentationTestsFolder } from "./presentation";

export const testsFolder: ContentItem = {
  name: "Tests",
  template: "jsScriptLibrary",
  icon: ICONS.jsScriptLibrary,
  fields: {},
  children: [
    apiTestSuiteScript,
    coreTestsFolder,
    contentTestsFolder,
    templatesTestsFolder,
    sitesTestsFolder,
    indexesTestsFolder,
    workflowsTestsFolder,
    languagesTestsFolder,
    securityTestsFolder,
    publishingTestsFolder,
    presentationTestsFolder,
  ],
};
