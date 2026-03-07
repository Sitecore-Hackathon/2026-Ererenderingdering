import type { HelperContext } from "../_shared";

export function addRoleToRoles({ gql }: HelperContext) {
  return async (roleName: string, parentRoles: string[]) => {
    const data = await gql(`
      mutation AddRoleToRoles($input: AddRoleToRolesInput!) {
        addRoleToRoles(input: $input) { successful }
      }
    `, { input: { roleName, parentRoles } });
    return data?.addRoleToRoles;
  };
}
