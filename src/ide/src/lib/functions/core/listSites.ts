import type { HelperContext } from "../_shared";

export function listSites({ gql }: HelperContext) {
  return async () => {
    const data = await gql(`query { sites { name hostName language rootPath } }`);
    return data?.sites ?? data;
  };
}
