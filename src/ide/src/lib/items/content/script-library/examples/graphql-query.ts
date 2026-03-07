import type { ContentItem } from "../../../constants";
import { TEMPLATE_IDS } from "../../../constants";

export const graphqlQueryScript: ContentItem = {
  name: "GraphQL Query",
  template: TEMPLATE_IDS.jsScript,
  fields: {
    Script: `// Query content tree via GraphQL
const result = await Sitecore.graphql(\`
  query {
    item(where: { database: "master", path: "/sitecore/content" }) {
      itemId
      name
      path
      children {
        nodes {
          itemId
          name
          path
        }
      }
    }
  }
\`);
print(JSON.stringify(result, null, 2));`,
  },
};
