import type { HelperContext } from "../_shared";
import { unwrap } from "../_shared";

export function retrievePage({ client, getSitecoreContextId }: HelperContext) {
  return async (pageId: string, site: string, language?: string) => {
    const sitecoreContextId = await getSitecoreContextId();
    const res = await (client as any).query("xmc.pages.retrievePage", {
      params: {
        query: { sitecoreContextId, sc_site: site, sc_lang: language ?? "en" },
        path: { pageId },
      },
    });
    return unwrap(res);
  };
}
