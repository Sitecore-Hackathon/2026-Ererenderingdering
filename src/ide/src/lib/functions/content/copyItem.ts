import type { HelperContext } from "../_shared";
import { isId, stripBraces } from "../_shared";

export function copyItem({ gql }: HelperContext) {
  return async (idOrPath: string, targetParent: string, opts?: { copyItemName?: string; deepCopy?: boolean; database?: string }) => {
    const input: any = {};
    if (isId(idOrPath)) input.itemId = stripBraces(idOrPath); else input.path = idOrPath;
    if (isId(targetParent)) input.targetParentId = stripBraces(targetParent); else input.targetParentPath = targetParent;
    if (opts?.copyItemName) input.copyItemName = opts.copyItemName;
    if (opts?.deepCopy != null) input.deepCopy = opts.deepCopy;
    if (opts?.database) input.database = opts.database;
    const data = await gql(`
      mutation CopyItem($input: CopyItemInput!) {
        copyItem(input: $input) { item { itemId name path } }
      }
    `, { input });
    return data?.copyItem?.item;
  };
}
