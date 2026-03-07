import type { HelperContext } from "../_shared";

export function removeSite({ gql }: HelperContext) {
  return async (input: any) => {
    const data = await gql(`
      mutation RemoveSite($input: RemoveSiteInput!) {
        removeSite(input: $input) { job { handle name done } }
      }
    `, { input });
    return data?.removeSite;
  };
}
