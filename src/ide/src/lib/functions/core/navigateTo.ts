import type { HelperContext } from "../_shared";

export function navigateTo({ client }: HelperContext) {
  return async (itemId: string) => {
    await (client as any).mutate("pages.context", {
      params: { body: { itemId } },
    });
  };
}
