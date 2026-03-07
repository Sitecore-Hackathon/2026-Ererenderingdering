import type { HelperContext } from "../_shared";

export function getMeta({ gql }: HelperContext) {
  return async () => {
    const data = await gql(`query { meta { version xMVersion } }`);
    return data?.meta;
  };
}
