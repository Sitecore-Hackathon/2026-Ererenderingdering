import type { HelperContext } from "../_shared";

export function deleteUser({ gql }: HelperContext) {
  return async (userName: string) => {
    const data = await gql(`
      mutation DeleteUser($input: DeleteUserInput!) {
        deleteUser(input: $input) { successful }
      }
    `, { input: { userName } });
    return data?.deleteUser;
  };
}
