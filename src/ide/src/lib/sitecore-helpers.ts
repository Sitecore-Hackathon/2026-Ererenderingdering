import type { ClientSDK } from "@sitecore-marketplace-sdk/client";
import { unwrap } from "./functions/_shared";
import type { HelperContext } from "./functions/_shared";

// Core
import { getContext } from "./functions/core";
import { graphql } from "./functions/core";
import { listSites } from "./functions/core";
import { retrievePage } from "./functions/core";
import { reloadCanvas } from "./functions/core";
import { navigateTo } from "./functions/core";

// Content & Items
import { getItem, getItemChildren, getMediaItem, search, createItem, createItemFromBranch, updateItem, deleteItem, renameItem, moveItem, copyItem, addItemVersion, deleteItemVersion, uploadMedia } from "./functions/content";

// Publishing
import { getPublishingStatus, getPublishingTargets, getPublishingQueue, publishItem, publishLanguageSpecificItems, publishSite, publishWithOptions, cancelPublishing } from "./functions/publishing";

// Search Indexes & Database
import { getIndex, getIndexes, rebuildIndexes, populateManagedSchema, rebuildLinkDatabase, cleanUpDatabases } from "./functions/indexes";

// Workflows & Jobs
import { getWorkflow, getWorkflows, getJob, getJobs, isJobQueued, isJobRunning, startWorkflow, executeWorkflowCommand } from "./functions/workflows";

// Translation
import { translatePage, translateSite } from "./functions/translation";

// Templates
import { getTemplate, getTemplates, getDataSourceTemplates, getTenantTemplates, createTemplate, updateTemplate, deleteTemplate, createTemplateFolder } from "./functions/templates";

// Sites & Solutions
import { getSite, getSites, getSiteCollections, getSolutionSites, searchSolutionSites, getSolutionTemplates, scaffoldSolution, createSite, createSiteCollection, removeSite, removeSiteCollection, renameSite, renameSiteCollection, cloneSite, updateSitesPos } from "./functions/sites";

// Languages & Archiving
import { getLanguage, getLanguages, getSupportedLanguages, getFallbackLanguage, getArchivedItem, getArchivedItems, addLanguage, deleteLanguage, deleteLanguages, archiveItem, archiveVersion, setItemArchiveDate, setVersionArchiveDate, restoreArchivedItem, restoreArchivedVersion, deleteArchivedItem, deleteArchivedVersion, emptyArchive } from "./functions/languages";

// Security
import { getCurrentUser, getUser, getUsers, getRole, getRoles, getDomain, getDomains, getSelectionProfiles, createUser, updateUser, deleteUser, unlockUser, enableUser, disableUser, resetUserSettings, changeUserPassword, createDomain, deleteDomain, createRole, deleteRole, addRoleToRoles, deleteRoleFromRoles, addAccountsToRole, deleteAccountsFromRole } from "./functions/security";

// Presentation & Meta
import { getAvailableRenderings, getPageDesigns, getPartialDesigns, getPageBranchesRoots, getDatabases, getMeta, configurePageDesigns } from "./functions/presentation";

export interface SitecoreHelpers {
  // Core
  getContext: () => Promise<any>;
  graphql: (query: string, variables?: Record<string, any>) => Promise<any>;
  listSites: () => Promise<any>;
  retrievePage: (pageId: string, site: string, language?: string) => Promise<any>;
  reloadCanvas: () => Promise<void>;
  navigateTo: (itemId: string) => Promise<void>;

  // 1. Content & Items
  getItem: (idOrPath: string, opts?: { language?: string; version?: number; database?: string }) => Promise<any>;
  getItemChildren: (path: string) => Promise<any[]>;
  getMediaItem: (idOrPath: string, opts?: { language?: string; version?: number; database?: string }) => Promise<any>;
  search: (query: {
    searchStatement?: any; filterStatement?: any; facetOnFields?: string[];
    facetMetrics?: any[]; index?: string; language?: string; latestVersionOnly?: boolean;
    paging?: { pageIndex?: number; pageSize?: number; skip?: number };
    sort?: { field: string; direction?: string }[];
  }) => Promise<any>;
  createItem: (parent: string, templateId: string, name: string, fields?: Record<string, string>, opts?: { language?: string; database?: string }) => Promise<any>;
  createItemFromBranch: (branchId: string, parent: string, name: string, fields?: Record<string, string>, opts?: { language?: string; database?: string }) => Promise<any>;
  updateItem: (idOrPath: string, fields: Record<string, string>, opts?: { language?: string; version?: number; database?: string }) => Promise<any>;
  deleteItem: (idOrPath: string, permanently?: boolean) => Promise<any>;
  renameItem: (idOrPath: string, newName: string, opts?: { database?: string }) => Promise<any>;
  moveItem: (idOrPath: string, targetParent: string, opts?: { sortOrder?: number; database?: string }) => Promise<any>;
  copyItem: (idOrPath: string, targetParent: string, opts?: { copyItemName?: string; deepCopy?: boolean; database?: string }) => Promise<any>;
  addItemVersion: (idOrPath: string, opts?: { language?: string; version?: number; versionName?: string; database?: string }) => Promise<any>;
  deleteItemVersion: (idOrPath: string, opts?: { language?: string; version?: number; database?: string }) => Promise<any>;
  uploadMedia: (itemPath: string, opts?: { alt?: string; database?: string; language?: string; overwriteExisting?: boolean; versioned?: boolean; includeExtensionInItemName?: boolean }) => Promise<any>;

  // 2. Publishing
  getPublishingStatus: (operationId: string) => Promise<any>;
  getPublishingTargets: () => Promise<any>;
  getPublishingQueue: (query: { sort: { field: string; direction: string }; paging?: { pageIndex: number; pageSize: number }; dateFilter?: { dateFrom: string; dateTo: string }; itemsFilter?: any }) => Promise<any>;
  publishItem: (input: { rootItemId?: string; rootItemPath?: string; rootItemIds?: string[]; rootItemPaths?: string[]; languages: string[]; targetDatabases: string[]; publishItemMode: string; publishSubItems?: boolean; publishRelatedItems?: boolean; sourceDatabase?: string; displayName?: string }) => Promise<any>;
  publishLanguageSpecificItems: (input: { itemsToPublish?: { id?: string; languages: string[] }[]; languages?: string[]; targetDatabases: string[]; publishItemMode: string; publishSubItems?: boolean; publishRelatedItems?: boolean; sourceDatabase?: string; displayName?: string }) => Promise<any>;
  publishSite: (input: { languages: string[]; targetDatabases: string[]; publishSiteMode: string; sourceDatabase?: string; displayName?: string }) => Promise<any>;
  publishWithOptions: (options: any[]) => Promise<any>;
  cancelPublishing: (operationId: string) => Promise<any>;

  // 3. Search Indexes & Database
  getIndex: (name: string) => Promise<any>;
  getIndexes: () => Promise<any>;
  rebuildIndexes: (names: string[]) => Promise<any>;
  populateManagedSchema: (names: string[]) => Promise<any>;
  rebuildLinkDatabase: (dbNames: string[]) => Promise<any>;
  cleanUpDatabases: (dbNames: string[]) => Promise<any>;

  // 4. Workflows & Jobs
  getWorkflow: (idOrItem: string | { itemId?: string; path?: string; database?: string }) => Promise<any>;
  getWorkflows: () => Promise<any>;
  getJob: (nameOrHandle: string) => Promise<any>;
  getJobs: () => Promise<any>;
  isJobQueued: (name: string) => Promise<boolean>;
  isJobRunning: (name: string) => Promise<boolean>;
  startWorkflow: (item: { itemId?: string; path?: string; database?: string; language?: string }) => Promise<any>;
  executeWorkflowCommand: (commandId: string, item: { itemId?: string; path?: string; database?: string; language?: string }, comments?: string) => Promise<any>;

  // 5. Translation
  translatePage: (pageId: string, targetLang: string, opts?: { sourceLanguage?: string; brandKitId?: string; translateIfTargetVersionExists?: boolean; database?: string }) => Promise<any>;
  translateSite: (siteId: string, targetLang: string, opts?: { sourceLanguage?: string; brandKitId?: string; translateIfTargetVersionExists?: boolean; database?: string }) => Promise<any>;

  // 6. Templates
  getTemplate: (idOrPath: string, opts?: { database?: string }) => Promise<any>;
  getTemplates: (opts?: { database?: string; path?: string; templateId?: string }) => Promise<any>;
  getDataSourceTemplates: (opts?: { database?: string }) => Promise<any>;
  getTenantTemplates: (siteName: string, opts?: { database?: string; hasPageDesign?: boolean }) => Promise<any>;
  createTemplate: (parent: string, name: string, opts?: { database?: string; language?: string; icon?: string; baseTemplates?: string[]; sections?: any[]; createStandardValuesItem?: boolean }) => Promise<any>;
  updateTemplate: (templateId: string, opts?: { name?: string; database?: string; language?: string; icon?: string; baseTemplates?: string[]; sections?: any[]; createStandardValuesItem?: boolean; deleteMissingFields?: boolean }) => Promise<any>;
  deleteTemplate: (templateId: string, opts?: { database?: string }) => Promise<any>;
  createTemplateFolder: (parent: string, name: string, opts?: { database?: string; language?: string }) => Promise<any>;

  // 7. Sites & Solutions
  getSite: (name: string) => Promise<any>;
  getSites: (includeSystem?: boolean) => Promise<any>;
  getSiteCollections: (opts?: { database?: string }) => Promise<any>;
  getSolutionSites: (opts?: { database?: string; siteName?: string; siteId?: string; siteCollectionID?: string; rootItemId?: string; includeNonSxaSites?: boolean }) => Promise<any>;
  searchSolutionSites: (filter?: any) => Promise<any>;
  getSolutionTemplates: (opts?: { database?: string }) => Promise<any>;
  scaffoldSolution: (input: { siteName: string; hostName: string; language: string; templateId: string; languages?: string[]; siteCollectionName?: string; siteCollectionDisplayName?: string; siteCollectionDescription?: string; siteDescription?: string; siteDisplayName?: string; posMappings?: any[]; database?: string }) => Promise<any>;
  createSite: (input: { siteName: string; hostName: string; language: string; templateId: string; collectionId: string; languages?: string[]; siteCollectionName?: string; siteCollectionDisplayName?: string; siteCollectionDescription?: string; siteDescription?: string; siteDisplayName?: string; description?: string; displayName?: string; posMappings?: any[]; database?: string }) => Promise<any>;
  createSiteCollection: (input: { name: string; displayName?: string; description?: string; database?: string }) => Promise<any>;
  removeSite: (input: { siteId?: string; siteName?: string; database?: string }) => Promise<any>;
  removeSiteCollection: (input: { id: string; database?: string }) => Promise<any>;
  renameSite: (input: { siteId?: string; siteName?: string; newName?: string; database?: string }) => Promise<any>;
  renameSiteCollection: (input: { id: string; name?: string; database?: string }) => Promise<any>;
  cloneSite: (input: { siteId?: string; siteName?: string; cloneName?: string; displayName?: string; description?: string; cloneSiteDefinitions?: boolean; posMappings?: any[]; database?: string }) => Promise<any>;
  updateSitesPos: (input: { posMappingsInput: { id: string; newValue: any[] }[]; database?: string }) => Promise<any>;

  // 8. Languages & Archiving
  getLanguage: (name: string) => Promise<any>;
  getLanguages: (db?: string) => Promise<any>;
  getSupportedLanguages: () => Promise<any>;
  getFallbackLanguage: (name: string, db?: string) => Promise<any>;
  getArchivedItem: (archivalId: string, archiveName?: string) => Promise<any>;
  getArchivedItems: (opts?: { archiveName?: string; pageIndex?: number; pageSize?: number }) => Promise<any>;
  addLanguage: (input: { languageCode: string; name?: string; database?: string; charset?: string; codePage?: string; customCode?: string; encoding?: string; fallbackCode?: string; regionCode?: string; spellChecker?: string; useSupportedLanguageAsFallback?: boolean }) => Promise<any>;
  deleteLanguage: (name: string, db?: string) => Promise<any>;
  deleteLanguages: (names: string[], db?: string) => Promise<any>;
  archiveItem: (idOrPath: string, archiveName?: string) => Promise<any>;
  archiveVersion: (idOrPath: string, language: string, version?: number, archiveName?: string) => Promise<any>;
  setItemArchiveDate: (idOrPath: string, date?: string) => Promise<any>;
  setVersionArchiveDate: (idOrPath: string, language: string, date?: string, version?: number) => Promise<any>;
  restoreArchivedItem: (archivalId: string, archiveName?: string) => Promise<any>;
  restoreArchivedVersion: (versionId: string, archiveName?: string) => Promise<any>;
  deleteArchivedItem: (archivalId: string, archiveName?: string) => Promise<any>;
  deleteArchivedVersion: (versionId: string, archiveName?: string) => Promise<any>;
  emptyArchive: (archiveName?: string) => Promise<any>;

  // 9. Security
  getCurrentUser: () => Promise<any>;
  getUser: (userName: string) => Promise<any>;
  getUsers: () => Promise<any>;
  getRole: (roleName: string) => Promise<any>;
  getRoles: () => Promise<any>;
  getDomain: (domainName: string) => Promise<any>;
  getDomains: () => Promise<any>;
  getSelectionProfiles: () => Promise<any>;
  createUser: (input: { userName: string; password: string; email?: string; fullName?: string; isAdministrator?: boolean; roleNames?: string[]; comment?: string; clientLanguage?: string; defaultContentLanguage?: string; portrait?: string; regionalIsoCode?: string; startUrl?: string; userProfileId?: string; wallpaper?: string }) => Promise<any>;
  updateUser: (input: { userName: string; email?: string; fullName?: string; isAdministrator?: boolean; roleNames?: string[]; comment?: string; clientLanguage?: string; defaultContentLanguage?: string; portrait?: string; regionalIsoCode?: string; startUrl?: string; userProfileId?: string; wallpaper?: string }) => Promise<any>;
  deleteUser: (userName: string) => Promise<any>;
  unlockUser: (userName: string) => Promise<any>;
  enableUser: (userName: string) => Promise<any>;
  disableUser: (userName: string) => Promise<any>;
  resetUserSettings: (userName: string) => Promise<any>;
  changeUserPassword: (userName: string, oldPw: string, newPw: string) => Promise<any>;
  createDomain: (domainName: string, local?: boolean) => Promise<any>;
  deleteDomain: (domainName: string) => Promise<any>;
  createRole: (roleName: string) => Promise<any>;
  deleteRole: (roleName: string) => Promise<any>;
  addRoleToRoles: (roleName: string, parentRoles: string[]) => Promise<any>;
  deleteRoleFromRoles: (roleName: string, parentRoles: string[]) => Promise<any>;
  addAccountsToRole: (roleName: string, opts?: { users?: string[]; roles?: string[] }) => Promise<any>;
  deleteAccountsFromRole: (roleName: string, opts?: { users?: string[]; roles?: string[] }) => Promise<any>;

  // 10. Presentation & Meta
  getAvailableRenderings: (opts?: { database?: string; renderingId?: string; siteRootItemId?: string }) => Promise<any>;
  getPageDesigns: (siteName: string, opts?: { database?: string }) => Promise<any>;
  getPartialDesigns: (siteName: string, opts?: { database?: string }) => Promise<any>;
  getPageBranchesRoots: (siteName: string, opts?: { database?: string }) => Promise<any>;
  getDatabases: () => Promise<any>;
  getMeta: () => Promise<any>;
  configurePageDesigns: (siteName: string, mapping: { templateId?: string; pageDesignId?: string }[], opts?: { database?: string }) => Promise<any>;
}

export function createSitecoreHelpers(client: ClientSDK): SitecoreHelpers {
  let cachedContextId: string | null = null;

  async function getSitecoreContextId(): Promise<string> {
    if (cachedContextId) return cachedContextId;
    const res = await client.query("application.context");
    const ctx = res.data;
    cachedContextId = ctx?.resourceAccess?.[0]?.context?.preview ?? null;
    if (!cachedContextId) {
      throw new Error("No Sitecore context ID available in resource access");
    }
    return cachedContextId;
  }

  async function gql(query: string, variables?: Record<string, any>): Promise<any> {
    const sitecoreContextId = await getSitecoreContextId();
    const res = await client.mutate("xmc.authoring.graphql", {
      params: {
        query: { sitecoreContextId },
        body: { query, variables },
      },
    });
    const data = unwrap(res);
    if (data?.data?.errors) throw new Error(JSON.stringify(data.data.errors));
    return data?.data;
  }

  const ctx: HelperContext = { gql, client, getSitecoreContextId };

  return {
    // Core
    getContext: getContext(ctx),
    graphql: graphql(ctx),
    listSites: listSites(ctx),
    retrievePage: retrievePage(ctx),
    reloadCanvas: reloadCanvas(ctx),
    navigateTo: navigateTo(ctx),

    // Content & Items
    getItem: getItem(ctx),
    getItemChildren: getItemChildren(ctx),
    getMediaItem: getMediaItem(ctx),
    search: search(ctx),
    createItem: createItem(ctx),
    createItemFromBranch: createItemFromBranch(ctx),
    updateItem: updateItem(ctx),
    deleteItem: deleteItem(ctx),
    renameItem: renameItem(ctx),
    moveItem: moveItem(ctx),
    copyItem: copyItem(ctx),
    addItemVersion: addItemVersion(ctx),
    deleteItemVersion: deleteItemVersion(ctx),
    uploadMedia: uploadMedia(ctx),

    // Publishing
    getPublishingStatus: getPublishingStatus(ctx),
    getPublishingTargets: getPublishingTargets(ctx),
    getPublishingQueue: getPublishingQueue(ctx),
    publishItem: publishItem(ctx),
    publishLanguageSpecificItems: publishLanguageSpecificItems(ctx),
    publishSite: publishSite(ctx),
    publishWithOptions: publishWithOptions(ctx),
    cancelPublishing: cancelPublishing(ctx),

    // Search Indexes & Database
    getIndex: getIndex(ctx),
    getIndexes: getIndexes(ctx),
    rebuildIndexes: rebuildIndexes(ctx),
    populateManagedSchema: populateManagedSchema(ctx),
    rebuildLinkDatabase: rebuildLinkDatabase(ctx),
    cleanUpDatabases: cleanUpDatabases(ctx),

    // Workflows & Jobs
    getWorkflow: getWorkflow(ctx),
    getWorkflows: getWorkflows(ctx),
    getJob: getJob(ctx),
    getJobs: getJobs(ctx),
    isJobQueued: isJobQueued(ctx),
    isJobRunning: isJobRunning(ctx),
    startWorkflow: startWorkflow(ctx),
    executeWorkflowCommand: executeWorkflowCommand(ctx),

    // Translation
    translatePage: translatePage(ctx),
    translateSite: translateSite(ctx),

    // Templates
    getTemplate: getTemplate(ctx),
    getTemplates: getTemplates(ctx),
    getDataSourceTemplates: getDataSourceTemplates(ctx),
    getTenantTemplates: getTenantTemplates(ctx),
    createTemplate: createTemplate(ctx),
    updateTemplate: updateTemplate(ctx),
    deleteTemplate: deleteTemplate(ctx),
    createTemplateFolder: createTemplateFolder(ctx),

    // Sites & Solutions
    getSite: getSite(ctx),
    getSites: getSites(ctx),
    getSiteCollections: getSiteCollections(ctx),
    getSolutionSites: getSolutionSites(ctx),
    searchSolutionSites: searchSolutionSites(ctx),
    getSolutionTemplates: getSolutionTemplates(ctx),
    scaffoldSolution: scaffoldSolution(ctx),
    createSite: createSite(ctx),
    createSiteCollection: createSiteCollection(ctx),
    removeSite: removeSite(ctx),
    removeSiteCollection: removeSiteCollection(ctx),
    renameSite: renameSite(ctx),
    renameSiteCollection: renameSiteCollection(ctx),
    cloneSite: cloneSite(ctx),
    updateSitesPos: updateSitesPos(ctx),

    // Languages & Archiving
    getLanguage: getLanguage(ctx),
    getLanguages: getLanguages(ctx),
    getSupportedLanguages: getSupportedLanguages(ctx),
    getFallbackLanguage: getFallbackLanguage(ctx),
    getArchivedItem: getArchivedItem(ctx),
    getArchivedItems: getArchivedItems(ctx),
    addLanguage: addLanguage(ctx),
    deleteLanguage: deleteLanguage(ctx),
    deleteLanguages: deleteLanguages(ctx),
    archiveItem: archiveItem(ctx),
    archiveVersion: archiveVersion(ctx),
    setItemArchiveDate: setItemArchiveDate(ctx),
    setVersionArchiveDate: setVersionArchiveDate(ctx),
    restoreArchivedItem: restoreArchivedItem(ctx),
    restoreArchivedVersion: restoreArchivedVersion(ctx),
    deleteArchivedItem: deleteArchivedItem(ctx),
    deleteArchivedVersion: deleteArchivedVersion(ctx),
    emptyArchive: emptyArchive(ctx),

    // Security
    getCurrentUser: getCurrentUser(ctx),
    getUser: getUser(ctx),
    getUsers: getUsers(ctx),
    getRole: getRole(ctx),
    getRoles: getRoles(ctx),
    getDomain: getDomain(ctx),
    getDomains: getDomains(ctx),
    getSelectionProfiles: getSelectionProfiles(ctx),
    createUser: createUser(ctx),
    updateUser: updateUser(ctx),
    deleteUser: deleteUser(ctx),
    unlockUser: unlockUser(ctx),
    enableUser: enableUser(ctx),
    disableUser: disableUser(ctx),
    resetUserSettings: resetUserSettings(ctx),
    changeUserPassword: changeUserPassword(ctx),
    createDomain: createDomain(ctx),
    deleteDomain: deleteDomain(ctx),
    createRole: createRole(ctx),
    deleteRole: deleteRole(ctx),
    addRoleToRoles: addRoleToRoles(ctx),
    deleteRoleFromRoles: deleteRoleFromRoles(ctx),
    addAccountsToRole: addAccountsToRole(ctx),
    deleteAccountsFromRole: deleteAccountsFromRole(ctx),

    // Presentation & Meta
    getAvailableRenderings: getAvailableRenderings(ctx),
    getPageDesigns: getPageDesigns(ctx),
    getPartialDesigns: getPartialDesigns(ctx),
    getPageBranchesRoots: getPageBranchesRoots(ctx),
    getDatabases: getDatabases(ctx),
    getMeta: getMeta(ctx),
    configurePageDesigns: configurePageDesigns(ctx),
  };
}
