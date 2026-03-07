import type { HelperContext } from "../_shared";
import { isId } from "../_shared";

export function setItemArchiveDate({ gql }: HelperContext) {
  return async (idOrPath: string, date?: string) => {
    const input: any = { archiveDate: date ?? null };
    if (isId(idOrPath)) input.itemId = idOrPath; else input.itemPath = idOrPath;
    const data = await gql(`
      mutation SetItemArchiveDate($input: SetItemArchiveDateInput!) {
        setItemArchiveDate(input: $input) { successful }
      }
    `, { input });
    return data?.setItemArchiveDate;
  };
}
