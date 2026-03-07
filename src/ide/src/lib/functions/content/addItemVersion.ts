import type { HelperContext } from "../_shared";
import { isId } from "../_shared";

export function addItemVersion({ gql }: HelperContext) {
  return async (idOrPath: string, opts?: { language?: string; version?: number; versionName?: string; database?: string }) => {
    const input: any = {};
    if (isId(idOrPath)) input.itemId = idOrPath; else input.path = idOrPath;
    if (opts?.language) input.language = opts.language;
    if (opts?.version != null) input.version = opts.version;
    if (opts?.versionName) input.versionName = opts.versionName;
    if (opts?.database) input.database = opts.database;
    const data = await gql(`
      mutation AddItemVersion($input: AddItemVersionInput!) {
        addItemVersion(input: $input) { item { itemId name path version } }
      }
    `, { input });
    return data?.addItemVersion?.item;
  };
}
