import type { HelperContext } from "../_shared";

export function emptyArchive({ gql }: HelperContext) {
  return async (archiveName?: string) => {
    const data = await gql(`
      mutation EmptyArchive($input: EmptyArchiveInput!) {
        emptyArchive(input: $input) { successful }
      }
    `, { input: { archiveName } });
    return data?.emptyArchive;
  };
}
