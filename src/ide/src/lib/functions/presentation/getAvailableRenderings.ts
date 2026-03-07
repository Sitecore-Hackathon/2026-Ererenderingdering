import type { HelperContext } from "../_shared";

export function getAvailableRenderings({ gql }: HelperContext) {
  return async (opts?: { database?: string; renderingId?: string; siteRootItemId?: string }) => {
    const where: any = {};
    if (opts?.database) where.database = opts.database;
    if (opts?.renderingId) where.renderingId = opts.renderingId;
    if (opts?.siteRootItemId) where.siteRootItemId = opts.siteRootItemId;
    const data = await gql(`
      query GetAvailableRenderings($where: GetRenderingsInput) {
        availableRenderings(where: $where) {
          itemId name path displayName
          datasourceTemplate { templateId name }
          renderingParametersTemplate { templateId name }
        }
      }
    `, { where });
    return data?.availableRenderings;
  };
}
