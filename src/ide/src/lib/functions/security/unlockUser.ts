import type { HelperContext } from "../_shared";

export function unlockUser({ gql }: HelperContext) {
  return async (userName: string) => {
    const data = await gql(`
      mutation UnlockUser($input: UnlockUserInput!) {
        unlockUser(input: $input) { successful }
      }
    `, { input: { userName } });
    return data?.unlockUser;
  };
}
