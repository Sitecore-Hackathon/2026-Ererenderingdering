import type { HelperContext } from "../_shared";

export function getSelectionProfiles({ gql }: HelperContext) {
  return async () => {
    const data = await gql(`query { selectionProfiles { nodes { name profileId } } }`);
    return data?.selectionProfiles?.nodes;
  };
}
