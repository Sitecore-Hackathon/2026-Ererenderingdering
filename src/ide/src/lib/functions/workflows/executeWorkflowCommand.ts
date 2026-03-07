import type { HelperContext } from "../_shared";

export function executeWorkflowCommand({ gql }: HelperContext) {
  return async (commandId: string, item: { itemId?: string; path?: string; database?: string; language?: string }, comments?: string) => {
    const data = await gql(`
      mutation ExecuteWorkflowCommand($input: ExecuteWorkflowCommandInput!) {
        executeWorkflowCommand(input: $input) { successful completed error message nextStateId }
      }
    `, { input: { commandId, item, comments } });
    return data?.executeWorkflowCommand;
  };
}
