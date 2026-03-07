import type { HelperContext } from "../_shared";

export function addLanguage({ gql }: HelperContext) {
  return async (input: any) => {
    const data = await gql(`
      mutation AddLanguage($input: AddLanguageInput!) {
        addLanguage(input: $input) { successful }
      }
    `, { input });
    return data?.addLanguage;
  };
}
