import type { HelperContext } from "../_shared";

export function getFallbackLanguage({ gql }: HelperContext) {
  return async (name: string, db?: string) => {
    const data = await gql(`
      query GetFallbackLanguage($name: String!, $db: String) {
        fallbackLanguage(name: $name, databaseName: $db) { name displayName englishName nativeName iso }
      }
    `, { name, db });
    return data?.fallbackLanguage;
  };
}
