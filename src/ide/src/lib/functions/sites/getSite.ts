import type { HelperContext } from "../_shared";

export function getSite({ gql }: HelperContext) {
  return async (name: string) => {
    const data = await gql(`
      query GetSite($name: String!) {
        site(siteName: $name) {
          name hostName language rootPath startPath contentStartPath
          database { name } contentDatabase { name } contentLanguage { name }
          rootItem { itemId name path } startItem { itemId name path }
          properties { key value }
        }
      }
    `, { name });
    return data?.site;
  };
}
