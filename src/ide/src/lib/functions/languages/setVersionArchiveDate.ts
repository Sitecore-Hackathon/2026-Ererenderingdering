import type { HelperContext } from "../_shared";
import { isId } from "../_shared";

export function setVersionArchiveDate({ gql }: HelperContext) {
  return async (idOrPath: string, language: string, date?: string, version?: number) => {
    const input: any = { language, archiveDate: date ?? null };
    if (isId(idOrPath)) input.itemId = idOrPath; else input.itemPath = idOrPath;
    if (version != null) input.version = version;
    const data = await gql(`
      mutation SetVersionArchiveDate($input: SetVersionArchiveDateInput!) {
        setVersionArchiveDate(input: $input) { successful }
      }
    `, { input });
    return data?.setVersionArchiveDate;
  };
}
