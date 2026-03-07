import type { HelperContext } from "../_shared";

export function cancelPublishing({ gql }: HelperContext) {
  return async (operationId: string) => {
    const data = await gql(`
      mutation CancelPublishing($id: String!) {
        cancelPublishing(publishingOperationId: $id) { success message publishingOperationId }
      }
    `, { id: operationId });
    return data?.cancelPublishing;
  };
}
