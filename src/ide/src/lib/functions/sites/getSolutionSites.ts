import type { HelperContext } from "../_shared";

export function getSolutionSites({ gql }: HelperContext) {
  return async (opts?: { database?: string; siteName?: string; siteId?: string; siteCollectionID?: string; rootItemId?: string; includeNonSxaSites?: boolean }) => {
    const data = await gql(`
      query GetSolutionSites($input: SolutionSitesInput) {
        solutionSites(input: $input) {
          id name displayName description hostname language created sortOrder linkableSite
          rootItem { itemId name path }
          siteCollection { id name }
          languages { name }
          posMappings { name language }
        }
      }
    `, { input: opts ?? {} });
    return data?.solutionSites;
  };
}
