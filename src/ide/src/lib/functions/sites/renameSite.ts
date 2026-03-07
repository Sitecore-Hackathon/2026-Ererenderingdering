import type { HelperContext } from "../_shared";

export function renameSite({ gql }: HelperContext) {
  return async (input: any) => {
    const data = await gql(`
      mutation RenameSite($input: RenameSiteInput!) {
        renameSite(input: $input) { job { handle name done } }
      }
    `, { input });
    return data?.renameSite;
  };
}
