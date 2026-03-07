import type { HelperContext } from "../_shared";

export function getPublishingStatus({ gql }: HelperContext) {
  return async (operationId: string) => {
    const data = await gql(`
      query GetPublishingStatus($id: String!) {
        publishingStatus(publishingOperationId: $id) {
          isDone isFailed processed state
          languages { name } targetDatabase { name }
        }
      }
    `, { id: operationId });
    return data?.publishingStatus;
  };
}
