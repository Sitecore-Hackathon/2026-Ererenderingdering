import type { ContentItem } from "../../../../constants";
import { ICONS } from "../../../../constants";
import { getCurrentUserTest } from "./get-current-user";
import { getUsersTest } from "./get-users";
import { getUserTest } from "./get-user";
import { getRolesTest } from "./get-roles";
import { getDomainsTest } from "./get-domains";
import { getDomainTest } from "./get-domain";
import { getSelectionProfilesTest } from "./get-selection-profiles";
import { createRoleTest } from "./create-role";
import { createDomainTest } from "./create-domain";
import { createUserTest } from "./create-user";
import { updateUserTest } from "./update-user";
import { disableEnableUserTest } from "./disable-enable-user";
import { unlockUserTest } from "./unlock-user";
import { resetUserSettingsTest } from "./reset-user-settings";
import { changeUserPasswordTest } from "./change-user-password";
import { roleMembershipTest } from "./role-membership";

export const securityTestsFolder: ContentItem = {
  name: "Security",
  template: "jsScriptLibrary",
  icon: ICONS.jsScriptLibrary,
  fields: {},
  children: [
    getCurrentUserTest,
    getUsersTest,
    getUserTest,
    getRolesTest,
    getDomainsTest,
    getDomainTest,
    getSelectionProfilesTest,
    createRoleTest,
    createDomainTest,
    createUserTest,
    updateUserTest,
    disableEnableUserTest,
    unlockUserTest,
    resetUserSettingsTest,
    changeUserPasswordTest,
    roleMembershipTest,
  ],
};
