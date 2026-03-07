import type { HelperContext } from "../_shared";

export function createRole({ gql }: HelperContext) {
  return async (roleName: string) => {
    const data = await gql(`
      mutation CreateRole($input: CreateRoleInput!) {
        createRole(input: $input) { role { name displayName } }
      }
    `, { input: { roleName } });
    return data?.createRole?.role;
  };
}
