import type { HelperContext } from "../_shared";

export function getSites({ gql }: HelperContext) {
  return async (includeSystem?: boolean) => {
    const data = await gql(`
      query GetSites($include: Boolean) {
        sites(includeSystemSites: $include) { name hostName language rootPath }
      }
    `, { include: includeSystem ?? false });
    return data?.sites;
  };
}
