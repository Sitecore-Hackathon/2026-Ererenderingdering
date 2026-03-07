import type { HelperContext } from "../_shared";

export function getPageBranchesRoots({ gql }: HelperContext) {
  return async (siteName: string, opts?: { database?: string }) => {
    const where: any = { siteName };
    if (opts?.database) where.database = opts.database;
    const data = await gql(`
      query GetPageBranchesRoots($where: DefaultPageBranchesInput) {
        pageBranchesRoots(where: $where) { siteName root { itemId name path } }
      }
    `, { where });
    return data?.pageBranchesRoots;
  };
}
