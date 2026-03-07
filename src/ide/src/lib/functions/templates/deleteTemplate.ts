import type { HelperContext } from "../_shared";

export function deleteTemplate({ gql }: HelperContext) {
  return async (templateId: string, opts?: { database?: string }) => {
    const input: any = { templateId: templateId.replace(/[{}]/g, '') };
    if (opts?.database) input.database = opts.database;
    const data = await gql(`
      mutation DeleteItemTemplate($input: DeleteItemTemplateInput!) {
        deleteItemTemplate(input: $input) { successful }
      }
    `, { input });
    return data?.deleteItemTemplate;
  };
}
