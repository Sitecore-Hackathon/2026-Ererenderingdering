import type { HelperContext } from "../_shared";

export function cloneSite({ gql }: HelperContext) {
  return async (input: any) => {
    const data = await gql(`
      mutation CloneSite($input: CloneSiteInput!) {
        cloneSite(input: $input) { job { handle name done } }
      }
    `, { input });
    return data?.cloneSite;
  };
}
