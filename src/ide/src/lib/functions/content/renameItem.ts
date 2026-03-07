import type { HelperContext } from "../_shared";
import { isId } from "../_shared";

export function renameItem({ gql }: HelperContext) {
  return async (idOrPath: string, newName: string, opts?: { database?: string }) => {
    const input: any = { newName };
    if (isId(idOrPath)) input.itemId = idOrPath; else input.path = idOrPath;
    if (opts?.database) input.database = opts.database;
    const data = await gql(`
      mutation RenameItem($input: RenameItemInput!) {
        renameItem(input: $input) { item { itemId name path } }
      }
    `, { input });
    return data?.renameItem?.item;
  };
}
