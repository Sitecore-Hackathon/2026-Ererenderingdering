import type { HelperContext } from "../_shared";

export function resetUserSettings({ gql }: HelperContext) {
  return async (userName: string) => {
    const data = await gql(`
      mutation ResetUserSettings($input: ResetUserSettingsInput!) {
        resetUserSettings(input: $input) { successful }
      }
    `, { input: { userName } });
    return data?.resetUserSettings;
  };
}
