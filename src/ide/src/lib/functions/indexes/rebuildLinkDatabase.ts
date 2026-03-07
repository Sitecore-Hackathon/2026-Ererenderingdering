import type { HelperContext } from "../_shared";

export function rebuildLinkDatabase({ gql }: HelperContext) {
  return async (dbNames: string[]) => {
    const data = await gql(`
      mutation RebuildLinkDatabase($input: RebuildLinkDatabaseInput!) {
        rebuildLinkDatabase(input: $input) { job { handle name done } }
      }
    `, { input: { databaseNames: dbNames } });
    return data?.rebuildLinkDatabase;
  };
}
