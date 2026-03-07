import type { HelperContext } from "../_shared";
import { isId } from "../_shared";

export function deleteItem({ gql }: HelperContext) {
  return async (idOrPath: string, permanently?: boolean) => {
    const input: any = { permanently };
    if (isId(idOrPath)) input.itemId = idOrPath; else input.path = idOrPath;
    const data = await gql(`
      mutation DeleteItem($input: DeleteItemInput!) {
        deleteItem(input: $input) { successful }
      }
    `, { input });
    return data?.deleteItem;
  };
}
