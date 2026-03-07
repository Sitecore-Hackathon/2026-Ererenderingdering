import type { ContentItem } from "../../../constants";
import { TEMPLATE_IDS } from "../../../constants";

export const getContextScript: ContentItem = {
  name: "Get Context",
  template: TEMPLATE_IDS.jsScript,
  fields: {
    Script: `// Get the current application context
const ctx = await Sitecore.getContext();
print(JSON.stringify(ctx, null, 2));`,
  },
};
