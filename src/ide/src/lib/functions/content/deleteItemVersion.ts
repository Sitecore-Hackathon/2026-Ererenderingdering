import type { HelperContext } from "../_shared";
import { isId } from "../_shared";

export function deleteItemVersion({ gql }: HelperContext) {
  return async (idOrPath: string, opts?: { language?: string; version?: number; database?: string }) => {
    const input: any = {};
    if (isId(idOrPath)) input.itemId = idOrPath; else input.path = idOrPath;
    if (opts?.language) input.language = opts.language;
    if (opts?.version != null) input.version = opts.version;
    if (opts?.database) input.database = opts.database;
    const data = await gql(`
      mutation DeleteItemVersion($input: DeleteItemVersionInput!) {
        deleteItemVersion(input: $input) { item { itemId name path version } }
      }
    `, { input });
    return data?.deleteItemVersion?.item;
  };
}
