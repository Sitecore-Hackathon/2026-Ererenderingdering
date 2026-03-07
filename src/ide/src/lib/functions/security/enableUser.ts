import type { HelperContext } from "../_shared";

export function enableUser({ gql }: HelperContext) {
  return async (userName: string) => {
    const data = await gql(`
      mutation EnableUser($input: EnableUserInput!) {
        enableUser(input: $input) { successful }
      }
    `, { input: { userName } });
    return data?.enableUser;
  };
}
