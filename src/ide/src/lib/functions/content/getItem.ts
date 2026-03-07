import type { HelperContext } from "../_shared";
import { itemWhere } from "../_shared";

export function getItem({ gql }: HelperContext) {
  return async (idOrPath: string, opts?: { language?: string; version?: number; database?: string }) => {
    const where = itemWhere(idOrPath, opts);
    const data = await gql(`
      query GetItem($where: ItemQueryInput) {
        item(where: $where) {
          itemId name path database displayName version
          template { templateId name }
          fields(ownFields: true, excludeStandardFields: true) { nodes { name value } }
          children { nodes { itemId name path } }
        }
      }
    `, { where });
    return data?.item;
  };
}
