import type { HelperContext } from "../_shared";

export function updateTemplate({ gql }: HelperContext) {
  return async (templateId: string, opts?: { name?: string; database?: string; language?: string; icon?: string; baseTemplates?: string[]; sections?: any[]; createStandardValuesItem?: boolean; deleteMissingFields?: boolean }) => {
    const input: any = { templateId, ...opts };
    const data = await gql(`
      mutation UpdateItemTemplate($input: UpdateItemTemplateInput!) {
        updateItemTemplate(input: $input) { itemTemplate { templateId name fullName } }
      }
    `, { input });
    return data?.updateItemTemplate?.itemTemplate;
  };
}
