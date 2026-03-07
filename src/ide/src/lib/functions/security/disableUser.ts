import type { HelperContext } from "../_shared";

export function disableUser({ gql }: HelperContext) {
  return async (userName: string) => {
    const data = await gql(`
      mutation DisableUser($input: DisableUserInput!) {
        disableUser(input: $input) { successful }
      }
    `, { input: { userName } });
    return data?.disableUser;
  };
}
