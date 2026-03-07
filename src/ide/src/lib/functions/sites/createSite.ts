import type { HelperContext } from "../_shared";

export function createSite({ gql }: HelperContext) {
  return async (input: any) => {
    const data = await gql(`
      mutation CreateSite($input: CreateSiteInput!) {
        createSite(input: $input) { job { handle name done } }
      }
    `, { input });
    return data?.createSite;
  };
}
