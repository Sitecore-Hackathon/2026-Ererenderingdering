import type { HelperContext } from "../_shared";

export function createTemplateFolder({ gql }: HelperContext) {
  return async (parent: string, name: string, opts?: { database?: string; language?: string }) => {
    const input: any = { parent, name };
    if (opts?.database) input.database = opts.database;
    if (opts?.language) input.language = opts.language;
    const data = await gql(`
      mutation CreateItemTemplateFolder($input: CreateItemTemplateFolderInput!) {
        createItemTemplateFolder(input: $input) { item { itemId name path } }
      }
    `, { input });
    return data?.createItemTemplateFolder?.item;
  };
}
