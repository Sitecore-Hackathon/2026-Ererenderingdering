import type { HelperContext } from "../_shared";

export function deleteArchivedItem({ gql }: HelperContext) {
  return async (archivalId: string, archiveName?: string) => {
    const input: any = { archivalId };
    if (archiveName) input.archiveName = archiveName;
    const data = await gql(`
      mutation DeleteArchivedItem($input: DeleteArchivedItemInput!) {
        deleteArchivedItem(input: $input) { successful }
      }
    `, { input });
    return data?.deleteArchivedItem;
  };
}
