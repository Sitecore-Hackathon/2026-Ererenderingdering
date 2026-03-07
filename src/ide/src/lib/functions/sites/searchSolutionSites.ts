import type { HelperContext } from "../_shared";

export function searchSolutionSites({ gql }: HelperContext) {
  return async (filter?: any) => {
    const data = await gql(`
      query SearchSolutionSites($input: SolutionSitesSearchInput) {
        solutionSitesSearch(input: $input) { nodes { siteRoot { itemId name path } sites { id name displayName } } }
      }
    `, { input: filter ? { filterStatement: filter } : {} });
    return data?.solutionSitesSearch?.nodes;
  };
}
