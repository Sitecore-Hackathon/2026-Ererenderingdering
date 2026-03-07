import type { HelperContext } from "../_shared";

export function updateUser({ gql }: HelperContext) {
  return async (input: any) => {
    const data = await gql(`
      mutation UpdateUser($input: UpdateUserInput!) {
        updateUser(input: $input) { user { name displayName } }
      }
    `, { input });
    return data?.updateUser?.user;
  };
}
