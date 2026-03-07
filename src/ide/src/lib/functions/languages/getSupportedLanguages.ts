import type { HelperContext } from "../_shared";

export function getSupportedLanguages({ gql }: HelperContext) {
  return async () => {
    const data = await gql(`query { supportedLanguages { nodes { name language charset codePage customCode encoding regionCode spellChecker } } }`);
    return data?.supportedLanguages?.nodes;
  };
}
