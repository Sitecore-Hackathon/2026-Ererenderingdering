import type { HelperContext } from "../_shared";

export function getLanguages({ gql }: HelperContext) {
  return async (db?: string) => {
    const data = await gql(`
      query GetLanguages($db: String) {
        languages(databaseName: $db) { nodes { name displayName englishName nativeName iso } }
      }
    `, { db });
    return data?.languages?.nodes;
  };
}
