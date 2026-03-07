import type { HelperContext } from "../_shared";

export function publishLanguageSpecificItems({ gql }: HelperContext) {
  return async (input: any) => {
    const data = await gql(`
      mutation PublishLanguageSpecificItems($input: PublishLanguageSpecificItemsInput!) {
        publishLanguageSpecificItems(input: $input) { operationId }
      }
    `, { input });
    return data?.publishLanguageSpecificItems;
  };
}
