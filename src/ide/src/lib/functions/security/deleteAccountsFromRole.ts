import type { HelperContext } from "../_shared";

export function deleteAccountsFromRole({ gql }: HelperContext) {
  return async (roleName: string, opts?: { users?: string[]; roles?: string[] }) => {
    const data = await gql(`
      mutation DeleteAccountsFromRole($input: DeleteAccountsFromRoleInput!) {
        deleteAccountsFromRole(input: $input) { successful }
      }
    `, { input: { roleName, users: opts?.users, roles: opts?.roles } });
    return data?.deleteAccountsFromRole;
  };
}
