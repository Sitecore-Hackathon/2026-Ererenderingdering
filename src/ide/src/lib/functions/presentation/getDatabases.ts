import type { HelperContext } from "../_shared";

export function getDatabases({ gql }: HelperContext) {
  return async () => {
    const data = await gql(`query { databases { nodes { name } } }`);
    return data?.databases?.nodes;
  };
}
