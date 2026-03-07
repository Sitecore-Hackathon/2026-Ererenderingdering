import type { HelperContext } from "../_shared";

export function rebuildIndexes({ gql }: HelperContext) {
  return async (names: string[]) => {
    const data = await gql(`
      mutation RebuildIndexes($input: RebuildIndexesInput) {
        rebuildIndexes(input: $input) { jobs { handle name done status { jobState processed total } } }
      }
    `, { input: { indexNames: names } });
    return data?.rebuildIndexes;
  };
}
