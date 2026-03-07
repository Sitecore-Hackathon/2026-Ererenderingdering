import type { HelperContext } from "../_shared";

export function createDomain({ gql }: HelperContext) {
  return async (domainName: string, local?: boolean) => {
    const input: any = { domainName };
    if (local != null) input.locallyManagedDomain = local;
    const data = await gql(`
      mutation CreateDomain($input: CreateDomainInput!) {
        createDomain(input: $input) { domain { name accountPrefix isDefault } }
      }
    `, { input });
    return data?.createDomain?.domain;
  };
}
