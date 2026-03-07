const sitecoreMethods: {
  label: string;
  detail: string;
  documentation: string;
  insertText: string;
}[] = [
  // ── Core ──────────────────────────────────────────────
  {
    label: "Sitecore.getContext",
    detail: "() => Promise<ApplicationContext>",
    documentation: "Get the current application context including tenant, organization, and resource access info.",
    insertText: "Sitecore.getContext()",
  },
  {
    label: "Sitecore.graphql",
    detail: "(query: string, variables?: object) => Promise<any>",
    documentation: "Execute a raw authoring GraphQL query or mutation against XM Cloud.",
    insertText: 'Sitecore.graphql(`\n  query {\n    item(where: { path: "/sitecore/content" }) {\n      itemId\n      name\n    }\n  }\n`)',
  },
  {
    label: "Sitecore.listSites",
    detail: "() => Promise<Site[]>",
    documentation: "List all sites configured in XM Cloud.",
    insertText: "Sitecore.listSites()",
  },
  {
    label: "Sitecore.retrievePage",
    detail: "(pageId: string, site: string, language?: string) => Promise<any>",
    documentation: "Retrieve a page by ID, site name, and optional language.",
    insertText: 'Sitecore.retrievePage("${1:pageId}", "${2:siteName}")',
  },
  {
    label: "Sitecore.reloadCanvas",
    detail: "() => Promise<void>",
    documentation: "Reload the Pages editor canvas.",
    insertText: "Sitecore.reloadCanvas()",
  },
  {
    label: "Sitecore.navigateTo",
    detail: "(itemId: string) => Promise<void>",
    documentation: "Navigate the Pages editor to a specific item by ID.",
    insertText: 'Sitecore.navigateTo("${1:itemId}")',
  },

  // ── 1. Content & Items ────────────────────────────────
  {
    label: "Sitecore.getItem",
    detail: "(idOrPath: string, opts?) => Promise<Item>",
    documentation: "Get a content item by ID or path. Options: language, version, database.",
    insertText: 'Sitecore.getItem("${1:/sitecore/content}")',
  },
  {
    label: "Sitecore.getItemChildren",
    detail: "(path: string) => Promise<Item[]>",
    documentation: "Get child items of the item at the given path.",
    insertText: 'Sitecore.getItemChildren("${1:/sitecore/content}")',
  },
  {
    label: "Sitecore.getMediaItem",
    detail: "(idOrPath: string, opts?) => Promise<MediaItem>",
    documentation: "Get a media item by ID or path. Options: language, version, database.",
    insertText: 'Sitecore.getMediaItem("${1:/sitecore/media library/image}")',
  },
  {
    label: "Sitecore.search",
    detail: "(query: SearchQueryInput) => Promise<SearchResult>",
    documentation: "Full-text & faceted search with criteria, filters, paging, and sorting.",
    insertText: 'Sitecore.search({\n  searchStatement: {\n    criteria: [{ field: "_name", value: "${1:Home}", criteriaType: "CONTAINS" }]\n  },\n  paging: { pageSize: 10 }\n})',
  },
  {
    label: "Sitecore.createItem",
    detail: "(parent: string, templateId: string, name: string, fields?, opts?) => Promise<Item>",
    documentation: "Create a new item under parent with given template. Fields as { Name: Value }.",
    insertText: 'Sitecore.createItem("${1:parentId}", "${2:templateId}", "${3:ItemName}", { "${4:Title}": "${5:Value}" })',
  },
  {
    label: "Sitecore.createItemFromBranch",
    detail: "(branchId: string, parent: string, name: string, fields?, opts?) => Promise<any>",
    documentation: "Create an item from a branch template.",
    insertText: 'Sitecore.createItemFromBranch("${1:branchId}", "${2:parentId}", "${3:ItemName}")',
  },
  {
    label: "Sitecore.updateItem",
    detail: "(idOrPath: string, fields: Record<string, string>, opts?) => Promise<Item>",
    documentation: "Update fields on a content item by ID or path. Options: language, version, database.",
    insertText: 'Sitecore.updateItem("${1:itemId}", { "${2:Title}": "${3:New Value}" })',
  },
  {
    label: "Sitecore.deleteItem",
    detail: "(idOrPath: string, permanently?: boolean) => Promise<any>",
    documentation: "Delete an item by ID or path. Optionally permanently delete.",
    insertText: 'Sitecore.deleteItem("${1:itemId}")',
  },
  {
    label: "Sitecore.renameItem",
    detail: "(idOrPath: string, newName: string) => Promise<Item>",
    documentation: "Rename an item.",
    insertText: 'Sitecore.renameItem("${1:itemId}", "${2:NewName}")',
  },
  {
    label: "Sitecore.moveItem",
    detail: "(idOrPath: string, targetParent: string, opts?) => Promise<Item>",
    documentation: "Move an item to a new parent. Options: sortOrder, database.",
    insertText: 'Sitecore.moveItem("${1:itemId}", "${2:targetParentId}")',
  },
  {
    label: "Sitecore.copyItem",
    detail: "(idOrPath: string, targetParent: string, opts?) => Promise<Item>",
    documentation: "Copy an item. Options: copyItemName, deepCopy, database.",
    insertText: 'Sitecore.copyItem("${1:itemId}", "${2:targetParentId}")',
  },
  {
    label: "Sitecore.addItemVersion",
    detail: "(idOrPath: string, opts?) => Promise<Item>",
    documentation: "Add a new version to an item. Options: language, version, versionName, database.",
    insertText: 'Sitecore.addItemVersion("${1:itemId}")',
  },
  {
    label: "Sitecore.deleteItemVersion",
    detail: "(idOrPath: string, opts?) => Promise<Item>",
    documentation: "Delete a version of an item. Options: language, version, database.",
    insertText: 'Sitecore.deleteItemVersion("${1:itemId}")',
  },
  {
    label: "Sitecore.uploadMedia",
    detail: "(itemPath: string, opts?) => Promise<{ presignedUploadUrl: string }>",
    documentation: "Get a pre-signed upload URL for media. Options: alt, database, language, overwriteExisting.",
    insertText: 'Sitecore.uploadMedia("${1:images/photo}")',
  },

  // ── 2. Publishing ─────────────────────────────────────
  {
    label: "Sitecore.getPublishingStatus",
    detail: "(operationId: string) => Promise<PublishingStatus>",
    documentation: "Check the progress of a publishing operation.",
    insertText: 'Sitecore.getPublishingStatus("${1:operationId}")',
  },
  {
    label: "Sitecore.getPublishingTargets",
    detail: "() => Promise<PublishingTarget[]>",
    documentation: "List all publishing targets.",
    insertText: "Sitecore.getPublishingTargets()",
  },
  {
    label: "Sitecore.getPublishingQueue",
    detail: "(query) => Promise<PublishingQueueEntryResult>",
    documentation: "Get publishing queue entries with sort, paging, and filters.",
    insertText: 'Sitecore.getPublishingQueue({ sort: { field: "date", direction: "DESCENDING" } })',
  },
  {
    label: "Sitecore.publishItem",
    detail: "(input) => Promise<{ operationId: string }>",
    documentation: "Publish an item. Specify rootItemId/Path, languages, targetDatabases, publishItemMode (FULL/SMART).",
    insertText: 'Sitecore.publishItem({\n  rootItemId: "${1:itemId}",\n  languages: ["en"],\n  targetDatabases: ["web"],\n  publishItemMode: "SMART",\n  publishSubItems: true\n})',
  },
  {
    label: "Sitecore.publishLanguageSpecificItems",
    detail: "(input) => Promise<{ operationId: string }>",
    documentation: "Publish items with per-item language specifications.",
    insertText: 'Sitecore.publishLanguageSpecificItems({\n  itemsToPublish: [{ id: "${1:itemId}", languages: ["en"] }],\n  targetDatabases: ["web"],\n  publishItemMode: "SMART"\n})',
  },
  {
    label: "Sitecore.publishSite",
    detail: "(input) => Promise<{ operationId: string }>",
    documentation: "Publish entire site. Mode: FULL, INCREMENTAL, or SMART.",
    insertText: 'Sitecore.publishSite({\n  languages: ["en"],\n  targetDatabases: ["web"],\n  publishSiteMode: "INCREMENTAL"\n})',
  },
  {
    label: "Sitecore.publishWithOptions",
    detail: "(options: PublishingOptionsInput[]) => Promise<{ operationId: string }>",
    documentation: "Advanced publish with detailed options per language/target.",
    insertText: 'Sitecore.publishWithOptions([{\n  language: "en",\n  targetDatabase: "web",\n  publishSiteMode: "SMART"\n}])',
  },
  {
    label: "Sitecore.cancelPublishing",
    detail: "(operationId: string) => Promise<any>",
    documentation: "Cancel an in-progress publishing operation.",
    insertText: 'Sitecore.cancelPublishing("${1:operationId}")',
  },

  // ── 3. Search Indexes & Database ──────────────────────
  {
    label: "Sitecore.getIndex",
    detail: "(name: string) => Promise<Index>",
    documentation: "Get info about a single search index.",
    insertText: 'Sitecore.getIndex("${1:sitecore_master_index}")',
  },
  {
    label: "Sitecore.getIndexes",
    detail: "() => Promise<Index[]>",
    documentation: "Get all search indexes.",
    insertText: "Sitecore.getIndexes()",
  },
  {
    label: "Sitecore.rebuildIndexes",
    detail: "(names: string[]) => Promise<any>",
    documentation: "Rebuild one or more search indexes.",
    insertText: 'Sitecore.rebuildIndexes(["${1:sitecore_master_index}"])',
  },
  {
    label: "Sitecore.populateManagedSchema",
    detail: "(names: string[]) => Promise<any>",
    documentation: "Populate managed schema for indexes.",
    insertText: 'Sitecore.populateManagedSchema(["${1:sitecore_master_index}"])',
  },
  {
    label: "Sitecore.rebuildLinkDatabase",
    detail: "(dbNames: string[]) => Promise<any>",
    documentation: "Rebuild the link database for specified databases.",
    insertText: 'Sitecore.rebuildLinkDatabase(["master"])',
  },
  {
    label: "Sitecore.cleanUpDatabases",
    detail: "(dbNames: string[]) => Promise<any>",
    documentation: "Clean up specified databases.",
    insertText: 'Sitecore.cleanUpDatabases(["master"])',
  },

  // ── 4. Workflows & Jobs ───────────────────────────────
  {
    label: "Sitecore.getWorkflow",
    detail: "(idOrItem: string | object) => Promise<Workflow>",
    documentation: "Get a workflow by workflow ID or item reference.",
    insertText: 'Sitecore.getWorkflow("${1:workflowId}")',
  },
  {
    label: "Sitecore.getWorkflows",
    detail: "() => Promise<Workflow[]>",
    documentation: "Get all configured workflows.",
    insertText: "Sitecore.getWorkflows()",
  },
  {
    label: "Sitecore.getJob",
    detail: "(nameOrHandle: string) => Promise<Job>",
    documentation: "Get a specific job by name or handle.",
    insertText: 'Sitecore.getJob("${1:jobName}")',
  },
  {
    label: "Sitecore.getJobs",
    detail: "() => Promise<Job[]>",
    documentation: "Get all jobs.",
    insertText: "Sitecore.getJobs()",
  },
  {
    label: "Sitecore.isJobQueued",
    detail: "(name: string) => Promise<boolean>",
    documentation: "Check if a job is queued.",
    insertText: 'Sitecore.isJobQueued("${1:jobName}")',
  },
  {
    label: "Sitecore.isJobRunning",
    detail: "(name: string) => Promise<boolean>",
    documentation: "Check if a job is running.",
    insertText: 'Sitecore.isJobRunning("${1:jobName}")',
  },
  {
    label: "Sitecore.startWorkflow",
    detail: "(item: { itemId?, path?, database?, language? }) => Promise<any>",
    documentation: "Start a workflow for an item. Resets to initial state.",
    insertText: 'Sitecore.startWorkflow({ itemId: "${1:itemId}" })',
  },
  {
    label: "Sitecore.executeWorkflowCommand",
    detail: "(commandId: string, item: object, comments?: string) => Promise<any>",
    documentation: "Execute a workflow command on an item.",
    insertText: 'Sitecore.executeWorkflowCommand("${1:commandId}", { itemId: "${2:itemId}" }, "${3:comments}")',
  },

  // ── 5. Translation ────────────────────────────────────
  {
    label: "Sitecore.translatePage",
    detail: "(pageId: string, targetLang: string, opts?) => Promise<any>",
    documentation: "Translate a page to a target language. Options: sourceLanguage, brandKitId, translateIfTargetVersionExists.",
    insertText: 'Sitecore.translatePage("${1:pageId}", "${2:fr-FR}")',
  },
  {
    label: "Sitecore.translateSite",
    detail: "(siteId: string, targetLang: string, opts?) => Promise<any>",
    documentation: "Translate an entire site. Options: sourceLanguage, brandKitId, translateIfTargetVersionExists.",
    insertText: 'Sitecore.translateSite("${1:siteId}", "${2:fr-FR}")',
  },

  // ── 6. Templates ──────────────────────────────────────
  {
    label: "Sitecore.getTemplate",
    detail: "(idOrPath: string, opts?) => Promise<ItemTemplate>",
    documentation: "Get a single template by ID or path with fields and sections.",
    insertText: 'Sitecore.getTemplate("${1:templateId}")',
  },
  {
    label: "Sitecore.getTemplates",
    detail: "(opts?) => Promise<ItemTemplate[]>",
    documentation: "List templates. Options: database, path, templateId.",
    insertText: "Sitecore.getTemplates()",
  },
  {
    label: "Sitecore.getDataSourceTemplates",
    detail: "(opts?) => Promise<ItemTemplate[]>",
    documentation: "Get data source templates.",
    insertText: "Sitecore.getDataSourceTemplates()",
  },
  {
    label: "Sitecore.getTenantTemplates",
    detail: "(siteName: string, opts?) => Promise<TenantTemplate[]>",
    documentation: "Get tenant templates for a site. Options: database, hasPageDesign.",
    insertText: 'Sitecore.getTenantTemplates("${1:siteName}")',
  },
  {
    label: "Sitecore.createTemplate",
    detail: "(parent: string, name: string, opts?) => Promise<ItemTemplate>",
    documentation: "Create a new template. Options: database, language, icon, baseTemplates, sections, createStandardValuesItem.",
    insertText: 'Sitecore.createTemplate("${1:parentId}", "${2:TemplateName}")',
  },
  {
    label: "Sitecore.updateTemplate",
    detail: "(templateId: string, opts?) => Promise<ItemTemplate>",
    documentation: "Update a template. Options: name, icon, baseTemplates, sections, deleteMissingFields.",
    insertText: 'Sitecore.updateTemplate("${1:templateId}", { name: "${2:NewName}" })',
  },
  {
    label: "Sitecore.deleteTemplate",
    detail: "(templateId: string) => Promise<any>",
    documentation: "Delete a template by ID.",
    insertText: 'Sitecore.deleteTemplate("${1:templateId}")',
  },
  {
    label: "Sitecore.createTemplateFolder",
    detail: "(parent: string, name: string) => Promise<Item>",
    documentation: "Create a template folder.",
    insertText: 'Sitecore.createTemplateFolder("${1:parentId}", "${2:FolderName}")',
  },

  // ── 7. Sites & Solutions ──────────────────────────────
  {
    label: "Sitecore.getSite",
    detail: "(name: string) => Promise<Site>",
    documentation: "Get a single site by name with full details.",
    insertText: 'Sitecore.getSite("${1:siteName}")',
  },
  {
    label: "Sitecore.getSites",
    detail: "(includeSystem?: boolean) => Promise<Site[]>",
    documentation: "Get all sites. Optionally include system sites.",
    insertText: "Sitecore.getSites()",
  },
  {
    label: "Sitecore.getSiteCollections",
    detail: "(opts?) => Promise<SiteCollection[]>",
    documentation: "Get site collections.",
    insertText: "Sitecore.getSiteCollections()",
  },
  {
    label: "Sitecore.getSolutionSites",
    detail: "(opts?) => Promise<SolutionSite[]>",
    documentation: "Get solution sites. Options: siteName, siteId, siteCollectionID, rootItemId, includeNonSxaSites.",
    insertText: "Sitecore.getSolutionSites()",
  },
  {
    label: "Sitecore.searchSolutionSites",
    detail: "(filter?) => Promise<SolutionSiteWithRoot[]>",
    documentation: "Search solution sites with optional filter statement.",
    insertText: "Sitecore.searchSolutionSites()",
  },
  {
    label: "Sitecore.getSolutionTemplates",
    detail: "(opts?) => Promise<SolutionTemplate[]>",
    documentation: "Get solution templates.",
    insertText: "Sitecore.getSolutionTemplates()",
  },
  {
    label: "Sitecore.scaffoldSolution",
    detail: "(input) => Promise<any>",
    documentation: "Scaffold a new solution with site, collection, and template.",
    insertText: 'Sitecore.scaffoldSolution({\n  siteName: "${1:MySite}",\n  hostName: "${2:mysite.com}",\n  language: "en",\n  templateId: "${3:templateId}"\n})',
  },
  {
    label: "Sitecore.createSite",
    detail: "(input) => Promise<any>",
    documentation: "Create a site in an existing collection.",
    insertText: 'Sitecore.createSite({\n  siteName: "${1:MySite}",\n  hostName: "${2:mysite.com}",\n  language: "en",\n  templateId: "${3:templateId}",\n  collectionId: "${4:collectionId}"\n})',
  },
  {
    label: "Sitecore.createSiteCollection",
    detail: "(input) => Promise<any>",
    documentation: "Create a site collection.",
    insertText: 'Sitecore.createSiteCollection({ name: "${1:CollectionName}" })',
  },
  {
    label: "Sitecore.removeSite",
    detail: "(input) => Promise<any>",
    documentation: "Remove a site by ID or name.",
    insertText: 'Sitecore.removeSite({ siteName: "${1:siteName}" })',
  },
  {
    label: "Sitecore.removeSiteCollection",
    detail: "(input) => Promise<any>",
    documentation: "Remove a site collection by ID.",
    insertText: 'Sitecore.removeSiteCollection({ id: "${1:collectionId}" })',
  },
  {
    label: "Sitecore.renameSite",
    detail: "(input) => Promise<any>",
    documentation: "Rename a site.",
    insertText: 'Sitecore.renameSite({ siteName: "${1:oldName}", newName: "${2:newName}" })',
  },
  {
    label: "Sitecore.renameSiteCollection",
    detail: "(input) => Promise<any>",
    documentation: "Rename a site collection.",
    insertText: 'Sitecore.renameSiteCollection({ id: "${1:collectionId}", name: "${2:newName}" })',
  },
  {
    label: "Sitecore.cloneSite",
    detail: "(input) => Promise<any>",
    documentation: "Clone a site.",
    insertText: 'Sitecore.cloneSite({ siteName: "${1:sourceSite}", cloneName: "${2:clonedSite}" })',
  },
  {
    label: "Sitecore.updateSitesPos",
    detail: "(input) => Promise<any>",
    documentation: "Update Point of Sale mappings for sites.",
    insertText: 'Sitecore.updateSitesPos({ posMappingsInput: [{ id: "${1:siteId}", newValue: [{ name: "${2:pos}", language: "en" }] }] })',
  },

  // ── 8. Languages & Archiving ──────────────────────────
  {
    label: "Sitecore.getLanguage",
    detail: "(name: string) => Promise<Language>",
    documentation: "Get a single language by name.",
    insertText: 'Sitecore.getLanguage("${1:en}")',
  },
  {
    label: "Sitecore.getLanguages",
    detail: "(db?: string) => Promise<Language[]>",
    documentation: "Get all languages. Optionally specify database.",
    insertText: "Sitecore.getLanguages()",
  },
  {
    label: "Sitecore.getSupportedLanguages",
    detail: "() => Promise<SupportedLanguage[]>",
    documentation: "Get all Sitecore-supported languages.",
    insertText: "Sitecore.getSupportedLanguages()",
  },
  {
    label: "Sitecore.getFallbackLanguage",
    detail: "(name: string, db?: string) => Promise<Language>",
    documentation: "Get the fallback language for a given language.",
    insertText: 'Sitecore.getFallbackLanguage("${1:en}")',
  },
  {
    label: "Sitecore.getArchivedItem",
    detail: "(archivalId: string, archiveName?) => Promise<ArchivedItem>",
    documentation: "Get a single archived item by archival ID.",
    insertText: 'Sitecore.getArchivedItem("${1:archivalId}")',
  },
  {
    label: "Sitecore.getArchivedItems",
    detail: "(opts?) => Promise<ArchivedItem[]>",
    documentation: "List archived items. Options: archiveName, pageIndex, pageSize.",
    insertText: "Sitecore.getArchivedItems()",
  },
  {
    label: "Sitecore.addLanguage",
    detail: "(input) => Promise<any>",
    documentation: "Add a language. Requires languageCode.",
    insertText: 'Sitecore.addLanguage({ languageCode: "${1:fr-FR}" })',
  },
  {
    label: "Sitecore.deleteLanguage",
    detail: "(name: string, db?: string) => Promise<any>",
    documentation: "Delete a language. Removes ALL versions of this language from every item.",
    insertText: 'Sitecore.deleteLanguage("${1:fr-FR}")',
  },
  {
    label: "Sitecore.deleteLanguages",
    detail: "(names: string[], db?: string) => Promise<any>",
    documentation: "Delete multiple languages at once.",
    insertText: 'Sitecore.deleteLanguages(["${1:fr-FR}", "${2:de-DE}"])',
  },
  {
    label: "Sitecore.archiveItem",
    detail: "(idOrPath: string, archiveName?) => Promise<any>",
    documentation: "Archive an item by ID or path.",
    insertText: 'Sitecore.archiveItem("${1:itemId}")',
  },
  {
    label: "Sitecore.archiveVersion",
    detail: "(idOrPath: string, language: string, version?, archiveName?) => Promise<any>",
    documentation: "Archive a specific version of an item.",
    insertText: 'Sitecore.archiveVersion("${1:itemId}", "en")',
  },
  {
    label: "Sitecore.setItemArchiveDate",
    detail: "(idOrPath: string, date?: string) => Promise<any>",
    documentation: "Schedule an item for archiving. Pass null/undefined to clear.",
    insertText: 'Sitecore.setItemArchiveDate("${1:itemId}", "${2:2025-12-31T00:00:00Z}")',
  },
  {
    label: "Sitecore.setVersionArchiveDate",
    detail: "(idOrPath: string, language: string, date?, version?) => Promise<any>",
    documentation: "Schedule a version for archiving.",
    insertText: 'Sitecore.setVersionArchiveDate("${1:itemId}", "en", "${2:2025-12-31T00:00:00Z}")',
  },
  {
    label: "Sitecore.restoreArchivedItem",
    detail: "(archivalId: string, archiveName?) => Promise<any>",
    documentation: "Restore an archived item.",
    insertText: 'Sitecore.restoreArchivedItem("${1:archivalId}")',
  },
  {
    label: "Sitecore.restoreArchivedVersion",
    detail: "(versionId: string, archiveName?) => Promise<any>",
    documentation: "Restore an archived version.",
    insertText: 'Sitecore.restoreArchivedVersion("${1:versionId}")',
  },
  {
    label: "Sitecore.deleteArchivedItem",
    detail: "(archivalId: string, archiveName?) => Promise<any>",
    documentation: "Permanently delete an archived item.",
    insertText: 'Sitecore.deleteArchivedItem("${1:archivalId}")',
  },
  {
    label: "Sitecore.deleteArchivedVersion",
    detail: "(versionId: string, archiveName?) => Promise<any>",
    documentation: "Permanently delete an archived version.",
    insertText: 'Sitecore.deleteArchivedVersion("${1:versionId}")',
  },
  {
    label: "Sitecore.emptyArchive",
    detail: "(archiveName?: string) => Promise<any>",
    documentation: "Empty the entire archive.",
    insertText: "Sitecore.emptyArchive()",
  },

  // ── 9. Security ───────────────────────────────────────
  {
    label: "Sitecore.getCurrentUser",
    detail: "() => Promise<User>",
    documentation: "Get the current authenticated user.",
    insertText: "Sitecore.getCurrentUser()",
  },
  {
    label: "Sitecore.getUser",
    detail: "(userName: string) => Promise<User>",
    documentation: "Get a specific user by username.",
    insertText: 'Sitecore.getUser("${1:sitecore\\\\admin}")',
  },
  {
    label: "Sitecore.getUsers",
    detail: "() => Promise<User[]>",
    documentation: "Get all users.",
    insertText: "Sitecore.getUsers()",
  },
  {
    label: "Sitecore.getRole",
    detail: "(roleName: string) => Promise<Role>",
    documentation: "Get a specific role with members and memberships.",
    insertText: 'Sitecore.getRole("${1:sitecore\\\\Author}")',
  },
  {
    label: "Sitecore.getRoles",
    detail: "() => Promise<Role[]>",
    documentation: "Get all roles.",
    insertText: "Sitecore.getRoles()",
  },
  {
    label: "Sitecore.getDomain",
    detail: "(domainName: string) => Promise<Domain>",
    documentation: "Get a specific security domain.",
    insertText: 'Sitecore.getDomain("${1:sitecore}")',
  },
  {
    label: "Sitecore.getDomains",
    detail: "() => Promise<Domain[]>",
    documentation: "Get all security domains.",
    insertText: "Sitecore.getDomains()",
  },
  {
    label: "Sitecore.getSelectionProfiles",
    detail: "() => Promise<UserProfileSelector[]>",
    documentation: "Get user profile selection profiles.",
    insertText: "Sitecore.getSelectionProfiles()",
  },
  {
    label: "Sitecore.createUser",
    detail: "(input) => Promise<User>",
    documentation: "Create a new user. Requires userName and password.",
    insertText: 'Sitecore.createUser({ userName: "${1:domain\\\\user}", password: "${2:password}", email: "${3:user@example.com}" })',
  },
  {
    label: "Sitecore.updateUser",
    detail: "(input) => Promise<User>",
    documentation: "Update user properties.",
    insertText: 'Sitecore.updateUser({ userName: "${1:domain\\\\user}", fullName: "${2:Full Name}" })',
  },
  {
    label: "Sitecore.deleteUser",
    detail: "(userName: string) => Promise<any>",
    documentation: "Delete a user.",
    insertText: 'Sitecore.deleteUser("${1:domain\\\\user}")',
  },
  {
    label: "Sitecore.unlockUser",
    detail: "(userName: string) => Promise<any>",
    documentation: "Unlock a locked-out user.",
    insertText: 'Sitecore.unlockUser("${1:domain\\\\user}")',
  },
  {
    label: "Sitecore.enableUser",
    detail: "(userName: string) => Promise<any>",
    documentation: "Enable a disabled user.",
    insertText: 'Sitecore.enableUser("${1:domain\\\\user}")',
  },
  {
    label: "Sitecore.disableUser",
    detail: "(userName: string) => Promise<any>",
    documentation: "Disable a user.",
    insertText: 'Sitecore.disableUser("${1:domain\\\\user}")',
  },
  {
    label: "Sitecore.resetUserSettings",
    detail: "(userName: string) => Promise<any>",
    documentation: "Reset user settings to defaults.",
    insertText: 'Sitecore.resetUserSettings("${1:domain\\\\user}")',
  },
  {
    label: "Sitecore.changeUserPassword",
    detail: "(userName: string, oldPw: string, newPw: string) => Promise<any>",
    documentation: "Change a user's password.",
    insertText: 'Sitecore.changeUserPassword("${1:domain\\\\user}", "${2:oldPassword}", "${3:newPassword}")',
  },
  {
    label: "Sitecore.createDomain",
    detail: "(domainName: string, local?: boolean) => Promise<Domain>",
    documentation: "Create a security domain.",
    insertText: 'Sitecore.createDomain("${1:domainName}")',
  },
  {
    label: "Sitecore.deleteDomain",
    detail: "(domainName: string) => Promise<any>",
    documentation: "Delete a security domain.",
    insertText: 'Sitecore.deleteDomain("${1:domainName}")',
  },
  {
    label: "Sitecore.createRole",
    detail: "(roleName: string) => Promise<Role>",
    documentation: "Create a security role.",
    insertText: 'Sitecore.createRole("${1:domain\\\\RoleName}")',
  },
  {
    label: "Sitecore.deleteRole",
    detail: "(roleName: string) => Promise<any>",
    documentation: "Delete a security role.",
    insertText: 'Sitecore.deleteRole("${1:domain\\\\RoleName}")',
  },
  {
    label: "Sitecore.addRoleToRoles",
    detail: "(roleName: string, parentRoles: string[]) => Promise<any>",
    documentation: "Add a role as member of parent roles.",
    insertText: 'Sitecore.addRoleToRoles("${1:domain\\\\Role}", ["${2:domain\\\\ParentRole}"])',
  },
  {
    label: "Sitecore.deleteRoleFromRoles",
    detail: "(roleName: string, parentRoles: string[]) => Promise<any>",
    documentation: "Remove a role from parent roles.",
    insertText: 'Sitecore.deleteRoleFromRoles("${1:domain\\\\Role}", ["${2:domain\\\\ParentRole}"])',
  },
  {
    label: "Sitecore.addAccountsToRole",
    detail: "(roleName: string, opts?: { users?, roles? }) => Promise<any>",
    documentation: "Add users and/or roles to a role.",
    insertText: 'Sitecore.addAccountsToRole("${1:domain\\\\Role}", { users: ["${2:domain\\\\user}"] })',
  },
  {
    label: "Sitecore.deleteAccountsFromRole",
    detail: "(roleName: string, opts?: { users?, roles? }) => Promise<any>",
    documentation: "Remove users and/or roles from a role.",
    insertText: 'Sitecore.deleteAccountsFromRole("${1:domain\\\\Role}", { users: ["${2:domain\\\\user}"] })',
  },

  // ── 10. Presentation & Meta ───────────────────────────
  {
    label: "Sitecore.getAvailableRenderings",
    detail: "(opts?) => Promise<RenderingItem[]>",
    documentation: "Get available renderings. Options: database, renderingId, siteRootItemId.",
    insertText: "Sitecore.getAvailableRenderings()",
  },
  {
    label: "Sitecore.getPageDesigns",
    detail: "(siteName: string, opts?) => Promise<PageDesign[]>",
    documentation: "Get page designs for a site.",
    insertText: 'Sitecore.getPageDesigns("${1:siteName}")',
  },
  {
    label: "Sitecore.getPartialDesigns",
    detail: "(siteName: string, opts?) => Promise<PartialDesign[]>",
    documentation: "Get partial designs for a site.",
    insertText: 'Sitecore.getPartialDesigns("${1:siteName}")',
  },
  {
    label: "Sitecore.getPageBranchesRoots",
    detail: "(siteName: string, opts?) => Promise<PageBranchesRoot[]>",
    documentation: "Get page branch roots for a site.",
    insertText: 'Sitecore.getPageBranchesRoots("${1:siteName}")',
  },
  {
    label: "Sitecore.getDatabases",
    detail: "() => Promise<Database[]>",
    documentation: "Get all databases.",
    insertText: "Sitecore.getDatabases()",
  },
  {
    label: "Sitecore.getMeta",
    detail: "() => Promise<{ version: string, xMVersion: string }>",
    documentation: "Get API version info.",
    insertText: "Sitecore.getMeta()",
  },
  {
    label: "Sitecore.configurePageDesigns",
    detail: "(siteName: string, mapping: { templateId?, pageDesignId? }[], opts?) => Promise<boolean>",
    documentation: "Map templates to page designs for a site.",
    insertText: 'Sitecore.configurePageDesigns("${1:siteName}", [{ templateId: "${2:templateId}", pageDesignId: "${3:pageDesignId}" }])',
  },
];

// ── Utilities ─────────────────────────────────────────────
const utilityFunctions: {
  label: string;
  detail: string;
  documentation: string;
  insertText: string;
}[] = [
  {
    label: "print",
    detail: "(...args: any[]) => void",
    documentation: "Print values to the Console output panel. Accepts multiple arguments.",
    insertText: "print(${1})",
  },
  {
    label: "render",
    detail: "(html: string) => void",
    documentation: "Render HTML content in the Results tab.",
    insertText: "render(`${1:<h1>Hello</h1>}`)",
  },
  {
    label: "help",
    detail: "(query?: string) => void",
    documentation: 'Display help for Sitecore SDK methods. help() for overview, help("getItem") for details.',
    insertText: 'help("${1}")',
  },
];

import { sitecoreSdkDts } from "./sitecore-sdk-dts";

const namespaceMap: Record<string, { description: string; methods: string[] }> = {
  Content: { description: "Content & Items", methods: ["getItem", "getItemChildren", "getMediaItem", "search", "createItem", "createItemFromBranch", "updateItem", "deleteItem", "renameItem", "moveItem", "copyItem", "addItemVersion", "deleteItemVersion", "uploadMedia"] },
  Publishing: { description: "Publishing", methods: ["getPublishingStatus", "getPublishingTargets", "getPublishingQueue", "publishItem", "publishLanguageSpecificItems", "publishSite", "publishWithOptions", "cancelPublishing"] },
  Indexes: { description: "Search Indexes & Database", methods: ["getIndex", "getIndexes", "rebuildIndexes", "populateManagedSchema", "rebuildLinkDatabase", "cleanUpDatabases"] },
  Workflows: { description: "Workflows & Jobs", methods: ["getWorkflow", "getWorkflows", "getJob", "getJobs", "isJobQueued", "isJobRunning", "startWorkflow", "executeWorkflowCommand"] },
  Translation: { description: "Translation", methods: ["translatePage", "translateSite"] },
  Templates: { description: "Templates", methods: ["getTemplate", "getTemplates", "getDataSourceTemplates", "getTenantTemplates", "createTemplate", "updateTemplate", "deleteTemplate", "createTemplateFolder"] },
  Sites: { description: "Sites & Solutions", methods: ["getSite", "getSites", "getSiteCollections", "getSolutionSites", "searchSolutionSites", "getSolutionTemplates", "scaffoldSolution", "createSite", "createSiteCollection", "removeSite", "removeSiteCollection", "renameSite", "renameSiteCollection", "cloneSite", "updateSitesPos"] },
  Languages: { description: "Languages & Archiving", methods: ["getLanguage", "getLanguages", "getSupportedLanguages", "getFallbackLanguage", "getArchivedItem", "getArchivedItems", "addLanguage", "deleteLanguage", "deleteLanguages", "archiveItem", "archiveVersion", "setItemArchiveDate", "setVersionArchiveDate", "restoreArchivedItem", "restoreArchivedVersion", "deleteArchivedItem", "deleteArchivedVersion", "emptyArchive"] },
  Security: { description: "Security", methods: ["getCurrentUser", "getUser", "getUsers", "getRole", "getRoles", "getDomain", "getDomains", "getSelectionProfiles", "createUser", "updateUser", "deleteUser", "unlockUser", "enableUser", "disableUser", "resetUserSettings", "changeUserPassword", "createDomain", "deleteDomain", "createRole", "deleteRole", "addRoleToRoles", "deleteRoleFromRoles", "addAccountsToRole", "deleteAccountsFromRole"] },
  Presentation: { description: "Presentation & Meta", methods: ["getAvailableRenderings", "getPageDesigns", "getPartialDesigns", "getPageBranchesRoots", "getDatabases", "getMeta", "configurePageDesigns"] },
};

export function registerCompletions(monaco: any) {
  // Register type definitions for IntelliSense, hover, and signature help
  const jsDefaults = monaco.languages.typescript.javascriptDefaults;
  jsDefaults.setDiagnosticsOptions({
    noSemanticValidation: false,
    noSyntaxValidation: false,
  });
  jsDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ESNext,
    allowNonTsExtensions: true,
    allowJs: true,
    checkJs: false,
  });
  jsDefaults.addExtraLib(
    sitecoreSdkDts,
    "ts:sitecore-sdk.d.ts"
  );

  monaco.languages.registerCompletionItemProvider("javascript", {
    triggerCharacters: ["."],
    provideCompletionItems(model: any, position: any) {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      const lineContent = model.getLineContent(position.lineNumber);
      const textBefore = lineContent.substring(0, position.column - 1);

      const suggestions: any[] = [];

      // Check for Sitecore.<Namespace>. or sc.<Namespace>. completions
      const nsMatch = textBefore.match(/(?:Sitecore|sc)\.(\w+)\.$/);
      if (nsMatch && namespaceMap[nsMatch[1]]) {
        const ns = namespaceMap[nsMatch[1]];
        const methodSet = new Set(ns.methods);
        for (const method of sitecoreMethods) {
          const methodName = method.label.replace("Sitecore.", "");
          if (methodSet.has(methodName)) {
            suggestions.push({
              label: methodName,
              kind: monaco.languages.CompletionItemKind.Method,
              detail: method.detail,
              documentation: method.documentation,
              insertText: method.insertText.replace("Sitecore.", ""),
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              range,
            });
          }
        }
      } else if (textBefore.endsWith("Sitecore.") || textBefore.endsWith("sc.")) {
        // Flat method completions
        for (const method of sitecoreMethods) {
          const methodName = method.label.replace("Sitecore.", "");
          suggestions.push({
            label: methodName,
            kind: monaco.languages.CompletionItemKind.Method,
            detail: method.detail,
            documentation: method.documentation,
            insertText: method.insertText.replace("Sitecore.", ""),
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range,
          });
        }
        // Namespace sub-objects
        for (const [nsName, ns] of Object.entries(namespaceMap)) {
          suggestions.push({
            label: nsName,
            kind: monaco.languages.CompletionItemKind.Module,
            detail: ns.description,
            documentation: `${ns.description} (${ns.methods.length} methods): ${ns.methods.join(", ")}`,
            insertText: nsName,
            range,
          });
        }
      } else {
        // Top-level completions for both Sitecore.* and sc.*
        for (const method of sitecoreMethods) {
          suggestions.push({
            label: method.label,
            kind: monaco.languages.CompletionItemKind.Method,
            detail: method.detail,
            documentation: method.documentation,
            insertText: method.insertText,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range,
          });
          // sc.* alias
          suggestions.push({
            label: method.label.replace("Sitecore.", "sc."),
            kind: monaco.languages.CompletionItemKind.Method,
            detail: method.detail,
            documentation: method.documentation + " (shorthand for Sitecore.*)",
            insertText: method.insertText.replace("Sitecore.", "sc."),
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range,
          });
        }
        for (const fn of utilityFunctions) {
          suggestions.push({
            label: fn.label,
            kind: monaco.languages.CompletionItemKind.Function,
            detail: fn.detail,
            documentation: fn.documentation,
            insertText: fn.insertText,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range,
          });
        }
      }

      return { suggestions };
    },
  });
}
