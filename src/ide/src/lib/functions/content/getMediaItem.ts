import type { HelperContext } from "../_shared";
import { isId } from "../_shared";

export function getMediaItem({ gql }: HelperContext) {
  return async (idOrPath: string, opts?: { language?: string; version?: number; database?: string }) => {
    const where: any = {};
    if (isId(idOrPath)) where.mediaItemId = idOrPath; else where.path = idOrPath;
    if (opts?.language) where.language = opts.language;
    if (opts?.version != null) where.version = opts.version;
    if (opts?.database) where.database = opts.database;
    const data = await gql(`
      query GetMediaItem($where: MediaItemQueryInput!) {
        mediaItem(where: $where) {
          alt description extension mediaPath mimeType size title
          url innerItem { itemId name path }
        }
      }
    `, { where });
    return data?.mediaItem;
  };
}
