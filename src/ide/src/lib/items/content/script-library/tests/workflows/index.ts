import type { ContentItem } from "../../../../constants";
import { ICONS } from "../../../../constants";
import { getWorkflowsTest } from "./get-workflows";
import { getWorkflowTest } from "./get-workflow";
import { getJobsTest } from "./get-jobs";
import { getJobTest } from "./get-job";
import { isJobQueuedTest } from "./is-job-queued";
import { isJobRunningTest } from "./is-job-running";

export const workflowsTestsFolder: ContentItem = {
  name: "Workflows",
  template: "jsScriptLibrary",
  icon: ICONS.jsScriptLibrary,
  fields: {},
  children: [
    getWorkflowsTest,
    getWorkflowTest,
    getJobsTest,
    getJobTest,
    isJobQueuedTest,
    isJobRunningTest,
  ],
};
