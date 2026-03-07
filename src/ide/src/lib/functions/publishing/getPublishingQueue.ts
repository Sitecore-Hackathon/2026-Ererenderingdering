import type { HelperContext } from "../_shared";

export function getPublishingQueue({ gql }: HelperContext) {
  return async (query: any) => {
    const data = await gql(`
      query GetPublishingQueue($query: PublishingQueueEntriesQueryInput!) {
        publishingQueueEntries(query: $query) {
          totalCount
          results { id itemId language action date item { name path templateName } }
        }
      }
    `, { query });
    return data?.publishingQueueEntries;
  };
}
