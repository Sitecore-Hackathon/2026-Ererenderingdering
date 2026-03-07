import type { HelperContext } from "../_shared";

export function addAccountsToRole({ gql }: HelperContext) {
  return async (roleName: string, opts?: { users?: string[]; roles?: string[] }) => {
    const data = await gql(`
      mutation AddAccountsToRole($input: AddAccountsToRoleInput!) {
        addAccountsToRole(input: $input) { successful }
      }
    `, { input: { roleName, users: opts?.users, roles: opts?.roles } });
    return data?.addAccountsToRole;
  };
}
