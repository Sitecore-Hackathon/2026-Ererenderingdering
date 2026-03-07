import type { HelperContext } from "../_shared";

export function uploadMedia({ gql }: HelperContext) {
  return async (itemPath: string, opts?: { alt?: string; database?: string; language?: string; overwriteExisting?: boolean; versioned?: boolean; includeExtensionInItemName?: boolean }) => {
    const input: any = { itemPath, ...opts };
    const data = await gql(`
      mutation UploadMedia($input: UploadMediaInput!) {
        uploadMedia(input: $input) { presignedUploadUrl }
      }
    `, { input });
    return data?.uploadMedia;
  };
}
