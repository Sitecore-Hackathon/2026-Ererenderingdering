import type { HelperContext } from "../_shared";

export function getContext({ client }: HelperContext) {
  return async () => {
    const res = await client.query("application.context");
    return res.data;
  };
}
