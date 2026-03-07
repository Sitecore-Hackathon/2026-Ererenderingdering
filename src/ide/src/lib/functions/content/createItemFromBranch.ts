import type { HelperContext } from "../_shared";
import { fieldsToInput } from "../_shared";

export function createItemFromBranch({ gql }: HelperContext) {
  return async (branchId: string, parent: string, name: string, fields?: Record<string, string>, opts?: { language?: string; database?: string }) => {
    const input: any = { branchId, parent, name, fields: fieldsToInput(fields) };
    if (opts?.language) input.language = opts.language;
    if (opts?.database) input.database = opts.database;
    const data = await gql(`
      mutation CreateItemFromBranch($input: CreateItemFromBranchInput!) {
        createItemFromBranch(input: $input) { job { handle name done } }
      }
    `, { input });
    return data?.createItemFromBranch;
  };
}
