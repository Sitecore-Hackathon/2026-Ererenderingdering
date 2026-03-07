import type { HelperContext } from "../_shared";

export function graphql({ gql }: HelperContext) {
  return async (query: string, variables?: Record<string, any>) => {
    return gql(query, variables);
  };
}
