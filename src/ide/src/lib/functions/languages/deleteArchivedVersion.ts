import type { HelperContext } from "../_shared";

export function deleteArchivedVersion({ gql }: HelperContext) {
  return async (versionId: string, archiveName?: string) => {
    const input: any = { versionId };
    if (archiveName) input.archiveName = archiveName;
    const data = await gql(`
      mutation DeleteArchivedVersion($input: DeleteArchivedVersionInput!) {
        deleteArchivedVersion(input: $input) { successful }
      }
    `, { input });
    return data?.deleteArchivedVersion;
  };
}
