import type { HelperContext } from "../_shared";

export function getDataSourceTemplates({ gql }: HelperContext) {
  return async (opts?: { database?: string }) => {
    const data = await gql(`
      query GetDataSourceTemplates($input: DefaultInput) {
        dataSourceTemplates(input: $input) { templates { templateId name fullName } }
      }
    `, { input: opts ?? {} });
    return data?.dataSourceTemplates?.templates;
  };
}
