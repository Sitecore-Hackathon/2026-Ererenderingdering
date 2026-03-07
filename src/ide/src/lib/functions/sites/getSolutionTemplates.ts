import type { HelperContext } from "../_shared";

export function getSolutionTemplates({ gql }: HelperContext) {
  return async (opts?: { database?: string }) => {
    const data = await gql(`
      query GetSolutionTemplates($input: DefaultSolutionInput) {
        solutionTemplates(input: $input) { id name description enabled builtInTemplate createdBy updated contents { key value } siteCollection { id name } }
      }
    `, { input: opts ?? {} });
    return data?.solutionTemplates;
  };
}
