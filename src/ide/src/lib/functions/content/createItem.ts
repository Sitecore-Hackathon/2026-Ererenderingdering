import type { HelperContext } from "../_shared";
import { fieldsToInput } from "../_shared";

export function createItem({ gql }: HelperContext) {
  return async (parent: string, templateId: string, name: string, fields?: Record<string, string>, opts?: { language?: string; database?: string }) => {
    const input: any = { parent, templateId, name, fields: fieldsToInput(fields) };
    if (opts?.language) input.language = opts.language;
    if (opts?.database) input.database = opts.database;
    const data = await gql(`
      mutation CreateItem($input: CreateItemInput!) {
        createItem(input: $input) { item { itemId name path } }
      }
    `, { input });
    return data?.createItem?.item;
  };
}
