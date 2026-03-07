import type { HelperContext } from "../_shared";

export function scaffoldSolution({ gql }: HelperContext) {
  return async (input: any) => {
    const data = await gql(`
      mutation ScaffoldSolution($input: CreateSolutionSiteInput!) {
        scaffoldSolution(input: $input) { job { handle name done } }
      }
    `, { input });
    return data?.scaffoldSolution;
  };
}
