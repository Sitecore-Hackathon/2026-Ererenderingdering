import type { HelperContext } from "../_shared";

export function getWorkflows({ gql }: HelperContext) {
  return async () => {
    const data = await gql(`query { workflows { nodes { workflowId displayName initialState { stateId displayName } } } }`);
    return data?.workflows?.nodes;
  };
}
