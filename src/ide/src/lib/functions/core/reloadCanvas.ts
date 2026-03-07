import type { HelperContext } from "../_shared";

export function reloadCanvas({ client }: HelperContext) {
  return async () => {
    await (client as any).mutate("pages.reloadCanvas");
  };
}
