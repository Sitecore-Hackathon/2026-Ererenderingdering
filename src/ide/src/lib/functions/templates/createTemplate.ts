import type { HelperContext } from "../_shared";

export function createTemplate({ gql }: HelperContext) {
  return async (parent: string, name: string, opts?: { database?: string; language?: string; icon?: string; baseTemplates?: string[]; sections?: any[]; createStandardValuesItem?: boolean }) => {
    const input: any = { parent, name };
    if (opts?.database) input.database = opts.database;
    if (opts?.language) input.language = opts.language;
    if (opts?.icon) input.icon = opts.icon;
    if (opts?.baseTemplates) input.baseTemplates = opts.baseTemplates;
    if (opts?.sections) input.sections = opts.sections;
    if (opts?.createStandardValuesItem != null) input.createStandardValuesItem = opts.createStandardValuesItem;
    const data = await gql(`
      mutation CreateItemTemplate($input: CreateItemTemplateInput!) {
        createItemTemplate(input: $input) { itemTemplate { templateId name fullName } }
      }
    `, { input });
    return data?.createItemTemplate?.itemTemplate;
  };
}
