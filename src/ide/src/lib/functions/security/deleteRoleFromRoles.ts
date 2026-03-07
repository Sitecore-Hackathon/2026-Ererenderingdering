import type { HelperContext } from "../_shared";

export function deleteRoleFromRoles({ gql }: HelperContext) {
  return async (roleName: string, parentRoles: string[]) => {
    const data = await gql(`
      mutation DeleteRoleFromRoles($input: DeleteRoleFromRolesInput!) {
        deleteRoleFromRoles(input: $input) { successful }
      }
    `, { input: { roleName, parentRoles } });
    return data?.deleteRoleFromRoles;
  };
}
