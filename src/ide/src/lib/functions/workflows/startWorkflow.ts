import type { HelperContext } from "../_shared";

export function startWorkflow({ gql }: HelperContext) {
  return async (item: { itemId?: string; path?: string; database?: string; language?: string }) => {
    const data = await gql(`
      mutation StartWorkflow($input: StartWorkflowInput!) {
        startWorkflow(input: $input) { successful }
      }
    `, { input: { item } });
    return data?.startWorkflow;
  };
}
