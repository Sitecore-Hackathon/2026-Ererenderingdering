import type { HelperContext } from "../_shared";

export function restoreArchivedVersion({ gql }: HelperContext) {
  return async (versionId: string, archiveName?: string) => {
    const input: any = { versionId };
    if (archiveName) input.archiveName = archiveName;
    const data = await gql(`
      mutation RestoreArchivedVersion($input: RestoreArchivedVersionInput!) {
        restoreArchivedVersion(input: $input) { successful }
      }
    `, { input });
    return data?.restoreArchivedVersion;
  };
}
