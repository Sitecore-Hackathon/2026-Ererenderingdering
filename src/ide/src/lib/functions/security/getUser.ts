import type { HelperContext } from "../_shared";

export function getUser({ gql }: HelperContext) {
  return async (userName: string) => {
    const data = await gql(`
      query GetUser($userName: String!) {
        user(userName: $userName) { name displayName localName isAdministrator isAuthenticated domain { name } profile { email fullName disabled lastLoginDate } roles { name } }
      }
    `, { userName });
    return data?.user;
  };
}
