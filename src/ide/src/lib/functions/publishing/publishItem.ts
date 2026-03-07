import type { HelperContext } from "../_shared";

export function publishItem({ gql }: HelperContext) {
  return async (input: any) => {
    const data = await gql(`
      mutation PublishItem($input: PublishItemInput!) {
        publishItem(input: $input) { operationId }
      }
    `, { input });
    return data?.publishItem;
  };
}
