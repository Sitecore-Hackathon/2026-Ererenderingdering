import type { HelperContext } from "../_shared";

export function getIndexes({ gql }: HelperContext) {
  return async () => {
    const data = await gql(`query { indexes { nodes { name documentsCount hasDeletions lastRebuildDuration lastUpdated numberOfFields numberOfTerms outOfDate } } }`);
    return data?.indexes?.nodes;
  };
}
