import type { HelperContext } from "../_shared";
import { isId } from "../_shared";

export function archiveItem({ gql }: HelperContext) {
  return async (idOrPath: string, archiveName?: string) => {
    const input: any = {};
    if (isId(idOrPath)) input.itemId = idOrPath; else input.itemPath = idOrPath;
    if (archiveName) input.archiveName = archiveName;
    const data = await gql(`
      mutation ArchiveItem($input: ArchiveItemInput!) {
        archiveItem(input: $input) { archiveItemId }
      }
    `, { input });
    return data?.archiveItem;
  };
}
