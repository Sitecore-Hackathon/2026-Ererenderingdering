import type { HelperContext } from "../_shared";

export function getArchivedItems({ gql }: HelperContext) {
  return async (opts?: { archiveName?: string; pageIndex?: number; pageSize?: number }) => {
    const data = await gql(`
      query GetArchivedItems($archiveName: String, $pageIndex: Int, $pageSize: Int) {
        archivedItems(archiveName: $archiveName, pageIndex: $pageIndex, pageSize: $pageSize) {
          archivalId itemId name database originalLocation archivedBy archivedDate
        }
      }
    `, { archiveName: opts?.archiveName, pageIndex: opts?.pageIndex, pageSize: opts?.pageSize });
    return data?.archivedItems;
  };
}
