import type { HelperContext } from "../_shared";

export function publishWithOptions({ gql }: HelperContext) {
  return async (options: any[]) => {
    const data = await gql(`
      mutation PublishWithOptions($input: PublishWithOptionsInput!) {
        publishWithOptions(input: $input) { operationId }
      }
    `, { input: { options } });
    return data?.publishWithOptions;
  };
}
