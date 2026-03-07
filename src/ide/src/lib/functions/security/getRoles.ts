import type { HelperContext } from "../_shared";

export function getRoles({ gql }: HelperContext) {
  return async () => {
    const data = await gql(`query { roles { nodes { name displayName localName description isEveryone isGlobal domain { name } } } }`);
    return data?.roles?.nodes;
  };
}
