import type { HelperContext } from "../_shared";

export function updateSitesPos({ gql }: HelperContext) {
  return async (input: any) => {
    const data = await gql(`
      mutation UpdateSolutionSitesPos($input: UpdateSolutionSitesPosInput!) {
        updateSolutionSitesPos(input: $input) { result { id success } }
      }
    `, { input });
    return data?.updateSolutionSitesPos;
  };
}
