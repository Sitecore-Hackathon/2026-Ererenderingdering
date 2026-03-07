import type { HelperContext } from "../_shared";

export function getLanguage({ gql }: HelperContext) {
  return async (name: string) => {
    const data = await gql(`
      query GetLanguage($name: String!) {
        language(name: $name) { name displayName englishName nativeName iso }
      }
    `, { name });
    return data?.language;
  };
}
