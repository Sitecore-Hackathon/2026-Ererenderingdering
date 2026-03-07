import type { HelperContext } from "../_shared";

export function isJobRunning({ gql }: HelperContext) {
  return async (name: string) => {
    const data = await gql(`query IsJobRunning($name: String!) { isJobRunning(jobName: $name) }`, { name });
    return data?.isJobRunning;
  };
}
