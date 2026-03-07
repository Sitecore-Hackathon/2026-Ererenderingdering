import type { HelperContext } from "../_shared";

export function populateManagedSchema({ gql }: HelperContext) {
  return async (names: string[]) => {
    const data = await gql(`
      mutation PopulateManagedSchema($input: PopulateManagedSchemaInput) {
        populateManagedSchema(input: $input) { jobs { handle name done } }
      }
    `, { input: { indexNames: names } });
    return data?.populateManagedSchema;
  };
}
