import type { HelperContext } from "../_shared";
import { isId } from "../_shared";

export function getWorkflow({ gql }: HelperContext) {
  return async (idOrItem: string | { itemId?: string; path?: string; database?: string }) => {
    const where: any = {};
    if (typeof idOrItem === "string") {
      if (isId(idOrItem)) where.workflowId = idOrItem;
      else where.item = { path: idOrItem };
    } else {
      where.item = idOrItem;
    }
    const data = await gql(`
      query GetWorkflow($where: WorkflowIdOrItemQueryInput!) {
        workflow(where: $where) {
          workflowId displayName
          initialState { stateId displayName final }
          states { nodes { stateId displayName final icon } }
        }
      }
    `, { where });
    return data?.workflow;
  };
}
