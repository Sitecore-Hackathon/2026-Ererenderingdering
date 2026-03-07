import type { HelperContext } from "../_shared";

export function getCurrentUser({ gql }: HelperContext) {
  return async () => {
    const data = await gql(`query { currentUser { name displayName localName isAdministrator isAuthenticated domain { name } profile { email fullName clientLanguage contentLanguage } roles { name displayName } } }`);
    return data?.currentUser;
  };
}
