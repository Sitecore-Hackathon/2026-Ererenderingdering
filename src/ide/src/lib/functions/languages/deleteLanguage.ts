import type { HelperContext } from "../_shared";

export function deleteLanguage({ gql }: HelperContext) {
  return async (name: string, db?: string) => {
    const input: any = { name };
    if (db) input.database = db;
    const data = await gql(`
      mutation DeleteLanguage($input: DeleteLanguageInput!) {
        deleteLanguage(input: $input) { successful }
      }
    `, { input });
    return data?.deleteLanguage;
  };
}
