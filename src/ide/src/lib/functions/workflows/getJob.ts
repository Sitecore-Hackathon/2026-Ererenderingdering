import type { HelperContext } from "../_shared";

export function getJob({ gql }: HelperContext) {
  return async (nameOrHandle: string) => {
    const input: any = {};
    if (nameOrHandle.includes("|")) input.handle = nameOrHandle; else input.jobName = nameOrHandle;
    const data = await gql(`
      query GetJob($input: JobQueryInput!) {
        job(input: $input) { handle name displayName done queueTime status { jobState processed total messages exceptions } options { jobName category siteName abortable } }
      }
    `, { input });
    return data?.job;
  };
}
