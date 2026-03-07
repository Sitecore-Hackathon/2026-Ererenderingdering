import type { HelperContext } from "../_shared";

export function getArchivedItem({ gql }: HelperContext) {
  return async (archivalId: string, archiveName?: string) => {
    const where: any = { archivalId };
    if (archiveName) where.archiveName = archiveName;
    const data = await gql(`
      query GetArchivedItem($where: ArchiveItemQueryInput) {
        archivedItem(where: $where) {
          archivalId itemId name database originalLocation archivedBy archivedDate parentId
          versions { versionId language version archivedBy archivalDate }
        }
      }
    `, { where });
    return data?.archivedItem;
  };
}
