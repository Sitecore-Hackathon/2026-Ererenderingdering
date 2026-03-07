import type { HelperContext } from "../_shared";

export function getPublishingTargets({ gql }: HelperContext) {
  return async () => {
    const data = await gql(`query { publishingTargets { name targetDatabase previewPublishingTarget } }`);
    return data?.publishingTargets;
  };
}
