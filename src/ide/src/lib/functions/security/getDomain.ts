import type { HelperContext } from "../_shared";

export function getDomain({ gql }: HelperContext) {
  return async (domainName: string) => {
    const data = await gql(`
      query GetDomain($domainName: String!) {
        domain(domainName: $domainName) { name accountPrefix isDefault ensureAnonymousUser anonymousUserName everyoneRoleName defaultProfileItemId accountNameValidation anonymousUserEmailPattern }
      }
    `, { domainName });
    return data?.domain;
  };
}
