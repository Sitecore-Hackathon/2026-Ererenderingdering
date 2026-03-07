import type { HelperContext } from "../_shared";

export function publishSite({ gql }: HelperContext) {
  return async (input: any) => {
    const data = await gql(`
      mutation PublishSite($input: PublishSiteInput!) {
        publishSite(input: $input) { operationId }
      }
    `, { input });
    return data?.publishSite;
  };
}
