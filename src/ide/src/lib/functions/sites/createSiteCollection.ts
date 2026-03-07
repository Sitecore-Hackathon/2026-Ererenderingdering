import type { HelperContext } from "../_shared";

export function createSiteCollection({ gql }: HelperContext) {
  return async (input: any) => {
    const data = await gql(`
      mutation CreateSiteCollection($input: CreateSiteCollectionInput!) {
        createSiteCollection(input: $input) { job { handle name done } }
      }
    `, { input });
    return data?.createSiteCollection;
  };
}
