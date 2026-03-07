import type { HelperContext } from "../_shared";

export function cleanUpDatabases({ gql }: HelperContext) {
  return async (dbNames: string[]) => {
    const data = await gql(`
      mutation CleanUpDatabases($input: CleanUpDatabasesInput!) {
        cleanUpDatabases(input: $input) { job { handle name done } }
      }
    `, { input: { databaseNames: dbNames } });
    return data?.cleanUpDatabases;
  };
}
