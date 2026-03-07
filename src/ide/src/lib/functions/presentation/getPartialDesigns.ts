import type { HelperContext } from "../_shared";

export function getPartialDesigns({ gql }: HelperContext) {
  return async (siteName: string, opts?: { database?: string }) => {
    const where: any = { siteName };
    if (opts?.database) where.database = opts.database;
    const data = await gql(`
      query GetPartialDesigns($where: DefaultPresentationInput) {
        partialDesigns(where: $where) { siteName partialDesign { itemId name path displayName } }
      }
    `, { where });
    return data?.partialDesigns;
  };
}
