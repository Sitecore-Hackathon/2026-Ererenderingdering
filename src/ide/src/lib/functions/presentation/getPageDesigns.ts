import type { HelperContext } from "../_shared";

export function getPageDesigns({ gql }: HelperContext) {
  return async (siteName: string, opts?: { database?: string }) => {
    const where: any = { siteName };
    if (opts?.database) where.database = opts.database;
    const data = await gql(`
      query GetPageDesigns($where: DefaultPresentationInput) {
        pageDesigns(where: $where) { siteName pageDesign { itemId name path displayName } }
      }
    `, { where });
    return data?.pageDesigns;
  };
}
