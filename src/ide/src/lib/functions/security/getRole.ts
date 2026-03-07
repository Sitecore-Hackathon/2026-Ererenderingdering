import type { HelperContext } from "../_shared";

export function getRole({ gql }: HelperContext) {
  return async (roleName: string) => {
    const data = await gql(`
      query GetRole($roleName: String!) {
        role(roleName: $roleName) { name displayName localName description isEveryone isGlobal domain { name } members { nodes { name accountType } } memberOf { nodes { name accountType } } }
      }
    `, { roleName });
    return data?.role;
  };
}
