import type { HelperContext } from "../_shared";

export function changeUserPassword({ gql }: HelperContext) {
  return async (userName: string, oldPw: string, newPw: string) => {
    const data = await gql(`
      mutation ChangeUserPassword($input: ChangeUserPasswordInput!) {
        changeUserPassword(input: $input) { successful }
      }
    `, { input: { userName, oldPassword: oldPw, newPassword: newPw } });
    return data?.changeUserPassword;
  };
}
