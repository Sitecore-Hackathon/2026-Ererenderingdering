import type { HelperContext } from "../_shared";

export function configurePageDesigns({ gql }: HelperContext) {
  return async (siteName: string, mapping: { templateId?: string; pageDesignId?: string }[], opts?: { database?: string }) => {
    const input: any = { siteName, mapping };
    if (opts?.database) input.database = opts.database;
    const data = await gql(`
      mutation ConfigurePageDesigns($input: ConfigurePageDesignsInput!) {
        configurePageDesigns(input: $input)
      }
    `, { input });
    return data?.configurePageDesigns;
  };
}
