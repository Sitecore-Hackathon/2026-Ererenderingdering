import type { HelperContext } from "../_shared";

export function deleteLanguages({ gql }: HelperContext) {
  return async (names: string[], db?: string) => {
    const input: any = { names };
    if (db) input.database = db;
    const data = await gql(`
      mutation DeleteLanguages($input: DeleteLanguagesInput!) {
        deleteLanguages(input: $input) { successful }
      }
    `, { input });
    return data?.deleteLanguages;
  };
}
