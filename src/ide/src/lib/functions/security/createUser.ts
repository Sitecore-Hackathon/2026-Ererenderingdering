import type { HelperContext } from "../_shared";

export function createUser({ gql }: HelperContext) {
  return async (input: any) => {
    const data = await gql(`
      mutation CreateUser($input: CreateUserInput!) {
        createUser(input: $input) { user { name displayName } }
      }
    `, { input });
    return data?.createUser?.user;
  };
}
