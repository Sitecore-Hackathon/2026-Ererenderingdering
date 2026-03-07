import type { HelperContext } from "../_shared";

export function isJobQueued({ gql }: HelperContext) {
  return async (name: string) => {
    const data = await gql(`query IsJobQueued($name: String!) { isJobQueued(jobName: $name) }`, { name });
    return data?.isJobQueued;
  };
}
