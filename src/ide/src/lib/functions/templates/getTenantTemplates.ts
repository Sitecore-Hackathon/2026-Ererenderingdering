import type { HelperContext } from "../_shared";

export function getTenantTemplates({ gql }: HelperContext) {
  return async (siteName: string, opts?: { database?: string; hasPageDesign?: boolean }) => {
    const where: any = { siteName };
    if (opts?.database) where.database = opts.database;
    if (opts?.hasPageDesign != null) where.hasPageDesign = opts.hasPageDesign;
    const data = await gql(`
      query GetTenantTemplates($where: TenantTemplatesInput) {
        tenantTemplates(where: $where) { template { templateId name fullName } pageDesign { itemId name } }
      }
    `, { where });
    return data?.tenantTemplates;
  };
}
