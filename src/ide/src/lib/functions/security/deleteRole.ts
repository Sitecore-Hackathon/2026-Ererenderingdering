import type { HelperContext } from "../_shared";

export function deleteRole({ gql }: HelperContext) {
  return async (roleName: string) => {
    const data = await gql(`
      mutation DeleteRole($input: DeleteRoleInput!) {
        deleteRole(input: $input) { successful }
      }
    `, { input: { roleName } });
    return data?.deleteRole;
  };
}
