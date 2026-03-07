import type { ContentItem } from "../../../constants";
import { TEMPLATE_IDS } from "../../../constants";

export const listSitesScript: ContentItem = {
  name: "List Sites",
  template: TEMPLATE_IDS.jsScript,
  fields: {
    Script: `// List all sites in XM Cloud
const sites = await Sitecore.listSites();
print(JSON.stringify(sites, null, 2));`,
  },
};
