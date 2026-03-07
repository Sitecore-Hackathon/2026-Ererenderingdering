import type { HelperContext } from "../_shared";

export function getDomains({ gql }: HelperContext) {
  return async () => {
    const data = await gql(`query { domains { nodes { name accountPrefix isDefault ensureAnonymousUser } } }`);
    return data?.domains?.nodes;
  };
}
