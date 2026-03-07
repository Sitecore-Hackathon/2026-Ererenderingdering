import type { HelperContext } from "../_shared";
import { isId, stripBraces } from "../_shared";

export function moveItem({ gql }: HelperContext) {
  return async (idOrPath: string, targetParent: string, opts?: { sortOrder?: number; database?: string }) => {
    const input: any = {};
    if (isId(idOrPath)) input.itemId = stripBraces(idOrPath); else input.path = idOrPath;
    if (isId(targetParent)) input.targetParentId = stripBraces(targetParent); else input.targetParentPath = targetParent;
    if (opts?.sortOrder != null) input.sortOrder = opts.sortOrder;
    if (opts?.database) input.database = opts.database;
    const data = await gql(`
      mutation MoveItem($input: MoveItemInput!) {
        moveItem(input: $input) { item { itemId name path } }
      }
    `, { input });
    return data?.moveItem?.item;
  };
}
