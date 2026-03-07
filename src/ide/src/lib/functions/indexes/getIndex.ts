import type { HelperContext } from "../_shared";

export function getIndex({ gql }: HelperContext) {
  return async (name: string) => {
    const data = await gql(`
      query GetIndex($name: String!) {
        index(indexName: $name) { name documentsCount hasDeletions lastRebuildDuration lastUpdated numberOfFields numberOfTerms outOfDate }
      }
    `, { name });
    return data?.index;
  };
}
