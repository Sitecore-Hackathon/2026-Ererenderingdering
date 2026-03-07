import type { HelperContext } from "../_shared";
import { isId } from "../_shared";

export function archiveVersion({ gql }: HelperContext) {
  return async (idOrPath: string, language: string, version?: number, archiveName?: string) => {
    const input: any = { language };
    if (isId(idOrPath)) input.itemId = idOrPath; else input.itemPath = idOrPath;
    if (version != null) input.version = version;
    if (archiveName) input.archiveName = archiveName;
    const data = await gql(`
      mutation ArchiveVersion($input: ArchiveVersionInput!) {
        archiveVersion(input: $input) { archiveVersionId }
      }
    `, { input });
    return data?.archiveVersion;
  };
}
