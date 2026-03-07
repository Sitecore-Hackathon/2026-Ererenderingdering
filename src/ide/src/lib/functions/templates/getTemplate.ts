import type { HelperContext } from "../_shared";
import { isId } from "../_shared";

export function getTemplate({ gql }: HelperContext) {
  return async (idOrPath: string, opts?: { database?: string }) => {
    const where: any = {};
    if (isId(idOrPath)) where.templateId = idOrPath; else where.path = idOrPath;
    if (opts?.database) where.database = opts.database;
    const data = await gql(`
      query GetTemplate($where: ItemTemplateQueryInput) {
        itemTemplate(where: $where) {
          templateId name fullName icon
          ownFields { nodes { templateFieldId name type key defaultValue source sortOrder section { name } } }
          sections { nodes { itemTemplateSectionId name key sortOrder } }
          baseTemplates(directOnly: true) { nodes { templateId name } }
        }
      }
    `, { where });
    return data?.itemTemplate;
  };
}
