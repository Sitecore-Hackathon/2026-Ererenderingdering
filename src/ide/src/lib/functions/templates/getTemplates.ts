import type { HelperContext } from "../_shared";

export function getTemplates({ gql }: HelperContext) {
  return async (opts?: { database?: string; path?: string; templateId?: string }) => {
    const where: any = {};
    if (opts?.database) where.database = opts.database;
    if (opts?.path) where.path = opts.path;
    if (opts?.templateId) where.templateId = opts.templateId;
    const data = await gql(`
      query GetTemplates($where: ItemTemplateQueryInput) {
        itemTemplates(where: $where) { nodes { templateId name fullName icon } }
      }
    `, { where });
    return data?.itemTemplates?.nodes;
  };
}
