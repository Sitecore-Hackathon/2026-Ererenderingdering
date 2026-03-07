import type { HelperContext } from "../_shared";

export function translateSite({ gql }: HelperContext) {
  return async (siteId: string, targetLang: string, opts?: { sourceLanguage?: string; brandKitId?: string; translateIfTargetVersionExists?: boolean; database?: string }) => {
    const input: any = { siteId, targetLanguage: targetLang, translateIfTargetVersionExists: opts?.translateIfTargetVersionExists ?? false };
    if (opts?.sourceLanguage) input.sourceLanguage = opts.sourceLanguage;
    if (opts?.brandKitId) input.brandKitId = opts.brandKitId;
    if (opts?.database) input.database = opts.database;
    const data = await gql(`
      mutation TranslateSite($input: TranslateSiteInput!) {
        translateSite(input: $input) { job { handle name done } }
      }
    `, { input });
    return data?.translateSite;
  };
}
