import type { HelperContext } from "../_shared";

export function getItemChildren({ gql }: HelperContext) {
  return async (path: string) => {
    const data = await gql(`
      query GetItemChildren($where: ItemQueryInput) {
        item(where: $where) {
          children { nodes { itemId name path fields(ownFields: true, excludeStandardFields: true) { nodes { name value } } } }
        }
      }
    `, { where: { path } });
    return data?.item?.children?.nodes ?? [];
  };
}
