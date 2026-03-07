import type { HelperContext } from "../_shared";
import { isId, fieldsToInput } from "../_shared";

export function updateItem({ gql }: HelperContext) {
  return async (idOrPath: string, fields: Record<string, string>, opts?: { language?: string; version?: number; database?: string }) => {
    const input: any = { fields: fieldsToInput(fields) };
    if (isId(idOrPath)) input.itemId = idOrPath; else input.path = idOrPath;
    if (opts?.language) input.language = opts.language;
    if (opts?.version != null) input.version = opts.version;
    if (opts?.database) input.database = opts.database;
    const data = await gql(`
      mutation UpdateItem($input: UpdateItemInput!) {
        updateItem(input: $input) { item { itemId name path } }
      }
    `, { input });
    return data?.updateItem?.item;
  };
}
