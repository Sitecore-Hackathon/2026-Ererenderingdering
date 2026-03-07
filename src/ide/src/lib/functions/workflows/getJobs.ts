import type { HelperContext } from "../_shared";

export function getJobs({ gql }: HelperContext) {
  return async () => {
    const data = await gql(`query { jobs { nodes { handle name displayName done queueTime status { jobState processed total } } } }`);
    return data?.jobs?.nodes;
  };
}
