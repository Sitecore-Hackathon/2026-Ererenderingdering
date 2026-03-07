import type { HelperContext } from "../_shared";

export function restoreArchivedItem({ gql }: HelperContext) {
  return async (archivalId: string, archiveName?: string) => {
    const input: any = { archivalId };
    if (archiveName) input.archiveName = archiveName;
    const data = await gql(`
      mutation RestoreArchivedItem($input: RestoreArchivedItemInput!) {
        restoreArchivedItem(input: $input) { successful }
      }
    `, { input });
    return data?.restoreArchivedItem;
  };
}
