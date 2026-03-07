import type { HelperContext } from "../_shared";

export function deleteDomain({ gql }: HelperContext) {
  return async (domainName: string) => {
    const data = await gql(`
      mutation DeleteDomain($input: DeleteDomainInput!) {
        deleteDomain(input: $input) { successful }
      }
    `, { input: { domainName } });
    return data?.deleteDomain;
  };
}
