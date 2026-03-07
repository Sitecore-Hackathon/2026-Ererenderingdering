import type { HelperContext } from "../_shared";

export function removeSiteCollection({ gql }: HelperContext) {
  return async (input: any) => {
    const data = await gql(`
      mutation RemoveSiteCollection($input: RemoveSiteCollectionInput!) {
        removeSiteCollection(input: $input) { job { handle name done } }
      }
    `, { input });
    return data?.removeSiteCollection;
  };
}
