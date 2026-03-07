import type { HelperContext } from "../_shared";

export function getUsers({ gql }: HelperContext) {
  return async () => {
    const data = await gql(`query { users { nodes { name displayName localName isAdministrator domain { name } } } }`);
    return data?.users?.nodes;
  };
}
