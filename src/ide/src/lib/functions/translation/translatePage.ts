import type { HelperContext } from "../_shared";

export function translatePage({ gql }: HelperContext) {
  return async (pageId: string, targetLang: string, opts?: { sourceLanguage?: string; brandKitId?: string; translateIfTargetVersionExists?: boolean; database?: string }) => {
    const input: any = { pageId, targetLanguage: targetLang, translateIfTargetVersionExists: opts?.translateIfTargetVersionExists ?? false };
    if (opts?.sourceLanguage) input.sourceLanguage = opts.sourceLanguage;
    if (opts?.brandKitId) input.brandKitId = opts.brandKitId;
    if (opts?.database) input.database = opts.database;
    const data = await gql(`
      mutation TranslatePage($input: TranslatePageInput!) {
        translatePage(input: $input) { job { handle name done } }
      }
    `, { input });
    return data?.translatePage;
  };
}
