import type { HelperContext } from "../_shared";

export function search({ gql }: HelperContext) {
  return async (query: any) => {
    const data = await gql(`
      query Search($query: SearchQueryInput!) {
        search(query: $query) {
          totalCount
          results { itemId name path displayName templateName templateId language { name } version createdBy createdDate updatedBy updatedDate }
          facets { name facets { name count } }
        }
      }
    `, { query });
    return data?.search;
  };
}
