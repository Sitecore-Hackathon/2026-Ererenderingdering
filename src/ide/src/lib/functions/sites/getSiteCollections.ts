import type { HelperContext } from "../_shared";

export function getSiteCollections({ gql }: HelperContext) {
  return async (opts?: { database?: string }) => {
    const data = await gql(`
      query GetSiteCollections($input: DefaultSolutionInput) {
        siteCollections(input: $input) { id name displayName description collectionName collectionDescription created createdBy itemPath sortOrder sharedSites }
      }
    `, { input: opts ?? {} });
    return data?.siteCollections;
  };
}
