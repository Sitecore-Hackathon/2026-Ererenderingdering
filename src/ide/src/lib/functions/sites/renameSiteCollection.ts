import type { HelperContext } from "../_shared";

export function renameSiteCollection({ gql }: HelperContext) {
  return async (input: any) => {
    const data = await gql(`
      mutation RenameSiteCollection($input: RenameSiteCollectionInput!) {
        renameSiteCollection(input: $input) { job { handle name done } }
      }
    `, { input });
    return data?.renameSiteCollection;
  };
}
