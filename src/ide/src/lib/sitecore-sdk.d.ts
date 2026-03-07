// Sitecore XM Cloud SDK Type Definitions
// These types are injected into the Monaco editor for IntelliSense, hover, and signature help.

// ── Result Types ─────────────────────────────────────────

interface SitecoreItem {
  /** The globally-unique identifier for the item */
  itemId: string;
  /** The item name (not localized) */
  name: string;
  /** The full item path from root */
  path: string;
  /** The database name */
  database: string;
  /** The localized display name */
  displayName: string;
  /** The version number */
  version: number;
  /** The item's template */
  template: { templateId: string; name: string };
  /** Item fields (own, non-standard) */
  fields: { nodes: Array<{ name: string; value: string }> };
  /** Direct child items */
  children: { nodes: Array<{ itemId: string; name: string; path: string }> };
}

interface SitecoreMediaItem {
  /** Alternative text */
  alt: string;
  /** Media description */
  description: string;
  /** File extension */
  extension: string;
  /** Path in the media library */
  mediaPath: string;
  /** MIME type */
  mimeType: string;
  /** File size in bytes */
  size: number;
  /** Media title */
  title: string;
  /** Public URL */
  url: string;
  /** The underlying Sitecore item */
  innerItem: { itemId: string; name: string; path: string };
}

interface SitecoreSearchResult {
  /** Total number of matching items */
  totalCount: number;
  /** Search result items */
  results: Array<{
    itemId: string;
    name: string;
    path: string;
    displayName: string;
    templateName: string;
    templateId: string;
    language: { name: string };
    version: number;
    createdBy: string;
    createdDate: string;
    updatedBy: string;
    updatedDate: string;
  }>;
  /** Facet categories */
  facets: Array<{ name: string; facets: Array<{ name: string; count: number }> }>;
}

interface SitecorePublishingStatus {
  /** Whether the operation is complete */
  isDone: boolean;
  /** Whether the operation failed */
  isFailed: boolean;
  /** Number of items processed */
  processed: number;
  /** Current state: INITIALIZING, QUEUED, RUNNING, FINISHED, ABORTED, etc. */
  state: string;
  /** Published languages */
  languages: Array<{ name: string }>;
  /** Target database */
  targetDatabase: { name: string };
}

interface SitecorePublishResult {
  /** The operation ID for tracking progress via getPublishingStatus() */
  operationId: string;
}

interface SitecoreIndex {
  /** Index name */
  name: string;
  /** Number of documents */
  documentsCount: number;
  /** Whether any documents have been deleted */
  hasDeletions: boolean;
  /** Duration of last rebuild */
  lastRebuildDuration: string;
  /** Last update timestamp */
  lastUpdated: string;
  /** Number of fields */
  numberOfFields: number;
  /** Number of terms */
  numberOfTerms: number;
  /** Whether the index is out of date */
  outOfDate: boolean;
}

interface SitecoreJob {
  /** Job handle (unique identifier) */
  handle: string;
  /** Job name */
  name: string;
  /** Job display name */
  displayName: string;
  /** Whether the job is finished */
  done: boolean;
  /** When the job was queued */
  queueTime: string;
  /** Job status */
  status: { jobState: string; processed: number; total: number; messages?: string[]; exceptions?: string[] };
  /** Job options */
  options?: { jobName: string; category: string; siteName: string; abortable: boolean };
}

interface SitecoreWorkflow {
  /** Workflow ID */
  workflowId: string;
  /** Display name */
  displayName: string;
  /** Initial workflow state */
  initialState: { stateId: string; displayName: string; final: boolean };
  /** All workflow states */
  states: { nodes: Array<{ stateId: string; displayName: string; final: boolean; icon: string }> };
}

interface SitecoreLanguage {
  /** Language code (e.g. "en", "fr-FR") */
  name: string;
  /** Localized display name */
  displayName: string;
  /** English name */
  englishName: string;
  /** Native name */
  nativeName: string;
  /** Two-letter ISO code */
  iso: string;
}

interface SitecoreSupportedLanguage {
  /** Language code */
  name: string;
  /** Language display name */
  language: string;
  /** Charset */
  charset: string;
  /** Code page */
  codePage: string;
  /** Custom code */
  customCode: string;
  /** Encoding */
  encoding: string;
  /** Region code */
  regionCode: string;
  /** Spell checker */
  spellChecker: string;
}

interface SitecoreArchivedItem {
  /** Archival ID */
  archivalId: string;
  /** Item ID */
  itemId: string;
  /** Item name */
  name: string;
  /** Database */
  database: string;
  /** Original location path */
  originalLocation: string;
  /** User who archived */
  archivedBy: string;
  /** Archival date */
  archivedDate: string;
  /** Parent item ID */
  parentId: string;
  /** Archived versions */
  versions?: Array<{ versionId: string; language: string; version: number; archivedBy: string; archivalDate: string }>;
}

interface SitecoreTemplate {
  /** Template ID */
  templateId: string;
  /** Template name */
  name: string;
  /** Full template path name */
  fullName: string;
  /** Template icon */
  icon: string;
  /** Own field definitions */
  ownFields?: { nodes: Array<{ templateFieldId: string; name: string; type: string; key: string; defaultValue: string; source: string; sortOrder: number; section: { name: string } }> };
  /** Template sections */
  sections?: { nodes: Array<{ itemTemplateSectionId: string; name: string; key: string; sortOrder: number }> };
  /** Direct base templates */
  baseTemplates?: { nodes: Array<{ templateId: string; name: string }> };
}

interface SitecoreSite {
  /** Site name */
  name: string;
  /** Host name */
  hostName: string;
  /** Default language */
  language: string;
  /** Root path */
  rootPath: string;
  /** Start path */
  startPath: string;
  /** Content start path */
  contentStartPath: string;
  /** Database info */
  database: { name: string };
  /** Content database */
  contentDatabase: { name: string };
  /** Content language */
  contentLanguage: { name: string };
  /** Root item */
  rootItem: { itemId: string; name: string; path: string };
  /** Start item */
  startItem: { itemId: string; name: string; path: string };
  /** Site properties */
  properties: Array<{ key: string; value: any }>;
}

interface SitecoreSolutionSite {
  /** Site ID */
  id: string;
  /** Site name */
  name: string;
  /** Display name */
  displayName: string;
  /** Description */
  description: string;
  /** Hostname */
  hostname: string;
  /** Default language */
  language: string;
  /** Creation date */
  created: string;
  /** Sort order */
  sortOrder: number;
  /** Whether site is linkable */
  linkableSite: boolean;
  /** Root item */
  rootItem: { itemId: string; name: string; path: string };
  /** Site collection */
  siteCollection: { id: string; name: string };
  /** Site languages */
  languages: Array<{ name: string }>;
  /** Point of sale mappings */
  posMappings: Array<{ name: string; language: string }>;
}

interface SitecoreSiteCollection {
  /** Collection ID */
  id: string;
  /** Collection name */
  name: string;
  /** Display name */
  displayName: string;
  /** Description */
  description: string;
  /** Collection name */
  collectionName: string;
  /** Collection description */
  collectionDescription: string;
  /** Created date */
  created: string;
  /** Creator */
  createdBy: string;
  /** Item path */
  itemPath: string;
  /** Sort order */
  sortOrder: number;
  /** Shared sites */
  sharedSites: string[];
}

interface SitecoreUser {
  /** User name (domain\user) */
  name: string;
  /** Display name */
  displayName: string;
  /** Local name (without domain) */
  localName: string;
  /** Whether the user is an administrator */
  isAdministrator: boolean;
  /** Whether the user is authenticated */
  isAuthenticated: boolean;
  /** User domain */
  domain: { name: string };
  /** User profile */
  profile?: { email: string; fullName: string; clientLanguage: string; contentLanguage: string; disabled?: boolean; lastLoginDate?: string };
  /** Assigned roles */
  roles?: Array<{ name: string; displayName?: string }>;
}

interface SitecoreRole {
  /** Role name (domain\role) */
  name: string;
  /** Display name */
  displayName: string;
  /** Local name (without domain) */
  localName: string;
  /** Description */
  description: string;
  /** Whether this is the everyone role */
  isEveryone: boolean;
  /** Whether this is a global role */
  isGlobal: boolean;
  /** Role domain */
  domain: { name: string };
  /** Accounts that are members of this role */
  members?: { nodes: Array<{ name: string; accountType: string }> };
  /** Roles this role is a member of */
  memberOf?: { nodes: Array<{ name: string; accountType: string }> };
}

interface SitecoreDomain {
  /** Domain name */
  name: string;
  /** Account prefix */
  accountPrefix: string;
  /** Whether this is the default domain */
  isDefault: boolean;
  /** Whether anonymous user is ensured */
  ensureAnonymousUser: boolean;
  /** Anonymous user name */
  anonymousUserName: string;
  /** Everyone role name */
  everyoneRoleName: string;
  /** Default profile item ID */
  defaultProfileItemId: string;
  /** Account name validation pattern */
  accountNameValidation: string;
  /** Anonymous user email pattern */
  anonymousUserEmailPattern: string;
}

interface SitecorePublishingTarget {
  /** Target name */
  name: string;
  /** Target database name */
  targetDatabase: string;
  /** Whether this is a preview publishing target */
  previewPublishingTarget: boolean;
}

interface SitecoreRendering {
  /** Rendering item ID */
  itemId: string;
  /** Rendering name */
  name: string;
  /** Rendering path */
  path: string;
  /** Display name */
  displayName: string;
  /** Datasource template */
  datasourceTemplate: { templateId: string; name: string };
  /** Rendering parameters template */
  renderingParametersTemplate: { templateId: string; name: string };
}

// ── Options Types ────────────────────────────────────────

interface ItemQueryOptions {
  /** Item language (e.g. "en") */
  language?: string;
  /** Item version number */
  version?: number;
  /** Database name (default: "master") */
  database?: string;
}

interface SearchQueryInput {
  /** Search criteria statement */
  searchStatement?: SearchStatementInput;
  /** Filter criteria statement */
  filterStatement?: SearchStatementInput;
  /** Fields to build facets on */
  facetOnFields?: string[];
  /** Facet metrics */
  facetMetrics?: Array<{ function: string; key: string }>;
  /** Index name to search in */
  index?: string;
  /** Language to search in */
  language?: string;
  /** Whether to return only latest versions */
  latestVersionOnly?: boolean;
  /** Paging parameters */
  paging?: { pageIndex?: number; pageSize?: number; skip?: number };
  /** Sort parameters */
  sort?: Array<{ field: string; direction?: "ASCENDING" | "DESCENDING" }>;
}

interface SearchStatementInput {
  /** Search criteria */
  criteria?: Array<{
    /** Field name (e.g. "_name", "_fullpath", "_templatename") */
    field: string;
    /** Search value */
    value: string;
    /** Criteria type: EXACT, STARTSWITH, CONTAINS, ENDSWITH, WILDCARD, SEARCH, RANGE, FUZZY, PROXIMITY, REGEXP */
    criteriaType?: "EXACT" | "STARTSWITH" | "CONTAINS" | "ENDSWITH" | "WILDCARD" | "SEARCH" | "RANGE" | "FUZZY" | "PROXIMITY" | "REGEXP";
    /** Operator: SHOULD, MUST, NOT */
    operator?: "SHOULD" | "MUST" | "NOT";
    /** Boost value */
    boost?: number;
    /** Additional parameters */
    parameters?: string;
  }>;
  /** Boolean operator for combining criteria: SHOULD, MUST, NOT */
  operator?: "SHOULD" | "MUST" | "NOT";
  /** Nested sub-statements */
  subStatements?: SearchStatementInput[];
}

interface PublishItemInput {
  /** Root item ID to publish */
  rootItemId?: string;
  /** Root item path to publish */
  rootItemPath?: string;
  /** Multiple root item IDs */
  rootItemIds?: string[];
  /** Multiple root item paths */
  rootItemPaths?: string[];
  /** Languages to publish */
  languages: string[];
  /** Target database names */
  targetDatabases: string[];
  /** Publish mode: "FULL" or "SMART" */
  publishItemMode: "FULL" | "SMART";
  /** Whether to publish sub-items */
  publishSubItems?: boolean;
  /** Whether to publish related items */
  publishRelatedItems?: boolean;
  /** Source database name */
  sourceDatabase?: string;
  /** Display name for the publish request */
  displayName?: string;
}

interface PublishSiteInput {
  /** Languages to publish */
  languages: string[];
  /** Target database names */
  targetDatabases: string[];
  /** Publish site mode: "FULL", "INCREMENTAL", or "SMART" */
  publishSiteMode: "FULL" | "INCREMENTAL" | "SMART";
  /** Source database name */
  sourceDatabase?: string;
  /** Display name for the publish request */
  displayName?: string;
}

interface CreateUserInput {
  /** User name (domain\user format) */
  userName: string;
  /** User password */
  password: string;
  /** Email address */
  email?: string;
  /** Full name */
  fullName?: string;
  /** Whether the user is an administrator */
  isAdministrator?: boolean;
  /** Role names to assign */
  roleNames?: string[];
  /** Comment about the user */
  comment?: string;
  /** Client language */
  clientLanguage?: string;
  /** Default content language */
  defaultContentLanguage?: string;
  /** Portrait */
  portrait?: string;
  /** Regional ISO code */
  regionalIsoCode?: string;
  /** Start URL */
  startUrl?: string;
  /** User profile ID */
  userProfileId?: string;
  /** Wallpaper */
  wallpaper?: string;
}

interface UpdateUserInput {
  /** User name (domain\user format) */
  userName: string;
  /** Email address */
  email?: string;
  /** Full name */
  fullName?: string;
  /** Whether the user is an administrator */
  isAdministrator?: boolean;
  /** Role names to assign */
  roleNames?: string[];
  /** Comment about the user */
  comment?: string;
  /** Client language */
  clientLanguage?: string;
  /** Default content language */
  defaultContentLanguage?: string;
  /** Portrait */
  portrait?: string;
  /** Regional ISO code */
  regionalIsoCode?: string;
  /** Start URL */
  startUrl?: string;
  /** User profile ID */
  userProfileId?: string;
  /** Wallpaper */
  wallpaper?: string;
}

interface AddLanguageInput {
  /** Language code (e.g. "fr-FR") */
  languageCode: string;
  /** Language name */
  name?: string;
  /** Database name */
  database?: string;
  /** Charset */
  charset?: string;
  /** Code page */
  codePage?: string;
  /** Custom code */
  customCode?: string;
  /** Encoding */
  encoding?: string;
  /** Fallback language code */
  fallbackCode?: string;
  /** Region code */
  regionCode?: string;
  /** Spell checker */
  spellChecker?: string;
  /** Use supported language definition as fallback (default: true) */
  useSupportedLanguageAsFallback?: boolean;
}

// ── Sitecore SDK Interface ───────────────────────────────

interface SitecoreSDK {
  // ── Core ──────────────────────────────────────────────

  /** Get the current application context including tenant, organization, and resource access info. */
  getContext(): Promise<any>;

  /**
   * Execute a raw GraphQL query or mutation against the XM Cloud Authoring API.
   * @param query - GraphQL query or mutation string
   * @param variables - Optional variables object
   * @example
   * const data = await sc.graphql(`
   *   query {
   *     item(where: { path: "/sitecore/content" }) {
   *       itemId
   *       name
   *     }
   *   }
   * `);
   */
  graphql(query: string, variables?: Record<string, any>): Promise<any>;

  /** List all sites configured in XM Cloud. Returns array of sites with name, hostName, language, rootPath. */
  listSites(): Promise<Array<{ name: string; hostName: string; language: string; rootPath: string }>>;

  /**
   * Retrieve a page by ID using the XM Cloud Pages API.
   * @param pageId - The page item ID
   * @param site - Site name
   * @param language - Language code (default: "en")
   */
  retrievePage(pageId: string, site: string, language?: string): Promise<any>;

  /** Reload the Pages editor canvas. */
  reloadCanvas(): Promise<void>;

  /**
   * Navigate the Pages editor to a specific item.
   * @param itemId - The item ID to navigate to
   */
  navigateTo(itemId: string): Promise<void>;

  // ── Content & Items ───────────────────────────────────

  /**
   * Get a content item by ID or path. Automatically detects whether the argument is a GUID or path.
   * @param idOrPath - Item ID (GUID) or Sitecore path
   * @param opts - Optional: language, version, database
   * @example
   * const item = await sc.getItem("/sitecore/content/Home");
   * const item = await sc.getItem("110D559F-DEA5-42EA-9C1C-8A5DF7E70EF9");
   */
  getItem(idOrPath: string, opts?: ItemQueryOptions): Promise<SitecoreItem>;

  /**
   * Get child items of the item at the given path.
   * @param path - Sitecore path
   * @example
   * const children = await sc.getItemChildren("/sitecore/content/Home");
   */
  getItemChildren(path: string): Promise<SitecoreItem[]>;

  /**
   * Get a media item by ID or path.
   * @param idOrPath - Media item ID or path (e.g. "/sitecore/media library/Images/photo")
   * @param opts - Optional: language, version, database
   */
  getMediaItem(idOrPath: string, opts?: ItemQueryOptions): Promise<SitecoreMediaItem>;

  /**
   * Full-text and faceted search across the content tree.
   * @param query - Search query with criteria, filters, paging, sorting, and facets
   * @example
   * const results = await sc.search({
   *   searchStatement: {
   *     criteria: [{ field: "_name", value: "Home", criteriaType: "CONTAINS" }]
   *   },
   *   paging: { pageSize: 10 }
   * });
   */
  search(query: SearchQueryInput): Promise<SitecoreSearchResult>;

  /**
   * Create a new content item.
   * @param parent - Parent item ID or path
   * @param templateId - Template ID for the new item
   * @param name - Item name
   * @param fields - Optional field values as `{ FieldName: "value" }`
   * @param opts - Optional: language, database
   * @example
   * const item = await sc.createItem(parentId, templateId, "My Page", { Title: "Hello" });
   */
  createItem(parent: string, templateId: string, name: string, fields?: Record<string, string>, opts?: { language?: string; database?: string }): Promise<SitecoreItem>;

  /**
   * Create an item from a branch template.
   * @param branchId - Branch template ID
   * @param parent - Parent item ID
   * @param name - Item name
   * @param fields - Optional field values
   * @param opts - Optional: language, database
   */
  createItemFromBranch(branchId: string, parent: string, name: string, fields?: Record<string, string>, opts?: { language?: string; database?: string }): Promise<{ job: SitecoreJob }>;

  /**
   * Update fields on a content item.
   * @param idOrPath - Item ID or path
   * @param fields - Field values to update as `{ FieldName: "value" }`
   * @param opts - Optional: language, version, database
   * @example
   * await sc.updateItem(itemId, { Title: "New Title", Body: "<p>Content</p>" });
   */
  updateItem(idOrPath: string, fields: Record<string, string>, opts?: ItemQueryOptions): Promise<SitecoreItem>;

  /**
   * Delete an item.
   * @param idOrPath - Item ID or path
   * @param permanently - If true, permanently deletes (no recycle bin). Default: false
   */
  deleteItem(idOrPath: string, permanently?: boolean): Promise<{ successful: boolean }>;

  /**
   * Rename an item.
   * @param idOrPath - Item ID or path
   * @param newName - New item name
   */
  renameItem(idOrPath: string, newName: string, opts?: { database?: string }): Promise<SitecoreItem>;

  /**
   * Move an item to a new parent.
   * @param idOrPath - Item ID or path to move
   * @param targetParent - Target parent ID or path
   * @param opts - Optional: sortOrder, database
   */
  moveItem(idOrPath: string, targetParent: string, opts?: { sortOrder?: number; database?: string }): Promise<SitecoreItem>;

  /**
   * Copy an item to a new parent.
   * @param idOrPath - Item ID or path to copy
   * @param targetParent - Target parent ID or path
   * @param opts - Optional: copyItemName, deepCopy (default: true), database
   */
  copyItem(idOrPath: string, targetParent: string, opts?: { copyItemName?: string; deepCopy?: boolean; database?: string }): Promise<SitecoreItem>;

  /**
   * Add a new version to an item.
   * @param idOrPath - Item ID or path
   * @param opts - Optional: language, version (base version), versionName, database
   */
  addItemVersion(idOrPath: string, opts?: { language?: string; version?: number; versionName?: string; database?: string }): Promise<SitecoreItem>;

  /**
   * Delete a version of an item.
   * @param idOrPath - Item ID or path
   * @param opts - Optional: language, version (if not specified, deletes latest), database
   */
  deleteItemVersion(idOrPath: string, opts?: { language?: string; version?: number; database?: string }): Promise<SitecoreItem>;

  /**
   * Get a pre-signed upload URL for media.
   * @param itemPath - Relative path under sitecore media library
   * @param opts - Optional: alt, database, language, overwriteExisting, versioned, includeExtensionInItemName
   * @returns Object with `presignedUploadUrl` to PUT the file to
   */
  uploadMedia(itemPath: string, opts?: { alt?: string; database?: string; language?: string; overwriteExisting?: boolean; versioned?: boolean; includeExtensionInItemName?: boolean }): Promise<{ presignedUploadUrl: string }>;

  // ── Publishing ────────────────────────────────────────

  /**
   * Check the progress of a publishing operation.
   * @param operationId - The operation ID returned from a publish call
   */
  getPublishingStatus(operationId: string): Promise<SitecorePublishingStatus>;

  /** List all publishing targets (e.g. "web" database). */
  getPublishingTargets(): Promise<SitecorePublishingTarget[]>;

  /**
   * Get publishing queue entries.
   * @param query - Query with sort (required), paging, dateFilter, itemsFilter
   * @example
   * const queue = await sc.getPublishingQueue({
   *   sort: { field: "date", direction: "DESCENDING" }
   * });
   */
  getPublishingQueue(query: { sort: { field: string; direction: "ASCENDING" | "DESCENDING" }; paging?: { pageIndex: number; pageSize: number }; dateFilter?: { dateFrom: string; dateTo: string }; itemsFilter?: any }): Promise<{ totalCount: number; results: any[] }>;

  /**
   * Publish one or more items.
   * @example
   * const result = await sc.publishItem({
   *   rootItemId: itemId,
   *   languages: ["en"],
   *   targetDatabases: ["web"],
   *   publishItemMode: "SMART",
   *   publishSubItems: true
   * });
   * // Track: await sc.getPublishingStatus(result.operationId);
   */
  publishItem(input: PublishItemInput): Promise<SitecorePublishResult>;

  /**
   * Publish items with per-item language specifications.
   * @example
   * await sc.publishLanguageSpecificItems({
   *   itemsToPublish: [{ id: itemId, languages: ["en", "fr"] }],
   *   targetDatabases: ["web"],
   *   publishItemMode: "SMART"
   * });
   */
  publishLanguageSpecificItems(input: { itemsToPublish?: Array<{ id?: string; languages: string[] }>; targetDatabases: string[]; publishItemMode: "FULL" | "SMART"; publishSubItems?: boolean; publishRelatedItems?: boolean; sourceDatabase?: string; displayName?: string }): Promise<SitecorePublishResult>;

  /**
   * Publish an entire site.
   * @example
   * await sc.publishSite({
   *   languages: ["en"],
   *   targetDatabases: ["web"],
   *   publishSiteMode: "INCREMENTAL"
   * });
   */
  publishSite(input: PublishSiteInput): Promise<SitecorePublishResult>;

  /**
   * Advanced publish with detailed options per language/target.
   * @param options - Array of publishing options
   */
  publishWithOptions(options: Array<{ language: string; targetDatabase: string; publishSiteMode?: "FULL" | "INCREMENTAL" | "SMART"; publishItemMode?: "FULL" | "SMART"; rootItemId?: string; rootItemPath?: string; publishSubItems?: boolean; publishRelatedItems?: boolean; sourceDatabase?: string; publishDate?: string }>): Promise<SitecorePublishResult>;

  /**
   * Cancel an in-progress publishing operation.
   * @param operationId - The operation ID to cancel
   */
  cancelPublishing(operationId: string): Promise<{ success: boolean; message: string; publishingOperationId: string }>;

  // ── Search Indexes & Database ─────────────────────────

  /**
   * Get info about a single search index.
   * @param name - Index name (e.g. "sitecore_master_index")
   */
  getIndex(name: string): Promise<SitecoreIndex>;

  /** Get all search indexes. */
  getIndexes(): Promise<SitecoreIndex[]>;

  /**
   * Rebuild one or more search indexes.
   * @param names - Array of index names to rebuild
   * @example
   * await sc.rebuildIndexes(["sitecore_master_index"]);
   */
  rebuildIndexes(names: string[]): Promise<{ jobs: SitecoreJob[] }>;

  /**
   * Populate managed schema for search indexes.
   * @param names - Array of index names
   */
  populateManagedSchema(names: string[]): Promise<{ jobs: SitecoreJob[] }>;

  /**
   * Rebuild the link database for specified databases.
   * @param dbNames - Array of database names (e.g. ["master"])
   */
  rebuildLinkDatabase(dbNames: string[]): Promise<{ job: SitecoreJob }>;

  /**
   * Clean up specified databases.
   * @param dbNames - Array of database names
   */
  cleanUpDatabases(dbNames: string[]): Promise<{ job: SitecoreJob }>;

  // ── Workflows & Jobs ──────────────────────────────────

  /**
   * Get a workflow by workflow ID, or by item reference.
   * @param idOrItem - Workflow ID (GUID string) or item reference object
   * @example
   * const wf = await sc.getWorkflow(workflowId);
   * const wf = await sc.getWorkflow({ itemId: myItemId });
   */
  getWorkflow(idOrItem: string | { itemId?: string; path?: string; database?: string }): Promise<SitecoreWorkflow>;

  /** Get all configured workflows. */
  getWorkflows(): Promise<SitecoreWorkflow[]>;

  /**
   * Get a specific job by name or handle. Names use simple string, handles contain "|".
   * @param nameOrHandle - Job name or job handle
   */
  getJob(nameOrHandle: string): Promise<SitecoreJob>;

  /** Get all jobs. */
  getJobs(): Promise<SitecoreJob[]>;

  /**
   * Check if a job is queued.
   * @param name - Job name
   */
  isJobQueued(name: string): Promise<boolean>;

  /**
   * Check if a job is running.
   * @param name - Job name
   */
  isJobRunning(name: string): Promise<boolean>;

  /**
   * Start a workflow for an item. Sets the state to initial and clears all workflow history.
   * @param item - Item reference with itemId or path
   */
  startWorkflow(item: { itemId?: string; path?: string; database?: string; language?: string }): Promise<{ successful: boolean }>;

  /**
   * Execute a workflow command on an item.
   * @param commandId - Workflow command ID
   * @param item - Item reference
   * @param comments - Optional workflow comments
   */
  executeWorkflowCommand(commandId: string, item: { itemId?: string; path?: string; database?: string; language?: string }, comments?: string): Promise<{ successful: boolean; completed: boolean; error: string; message: string; nextStateId: string }>;

  // ── Translation ───────────────────────────────────────

  /**
   * Translate a page to a target language using AI translation.
   * @param pageId - Page item ID
   * @param targetLang - Target language code (e.g. "fr-FR")
   * @param opts - Optional: sourceLanguage, brandKitId, translateIfTargetVersionExists (default: false)
   */
  translatePage(pageId: string, targetLang: string, opts?: { sourceLanguage?: string; brandKitId?: string; translateIfTargetVersionExists?: boolean; database?: string }): Promise<{ job: SitecoreJob }>;

  /**
   * Translate an entire site to a target language using AI translation.
   * @param siteId - Site ID
   * @param targetLang - Target language code
   * @param opts - Optional: sourceLanguage, brandKitId, translateIfTargetVersionExists (default: false)
   */
  translateSite(siteId: string, targetLang: string, opts?: { sourceLanguage?: string; brandKitId?: string; translateIfTargetVersionExists?: boolean; database?: string }): Promise<{ job: SitecoreJob }>;

  // ── Templates ─────────────────────────────────────────

  /**
   * Get a single template by ID or path, with fields, sections, and base templates.
   * @param idOrPath - Template ID or path
   * @param opts - Optional: database
   */
  getTemplate(idOrPath: string, opts?: { database?: string }): Promise<SitecoreTemplate>;

  /**
   * List templates.
   * @param opts - Optional: database, path, templateId
   */
  getTemplates(opts?: { database?: string; path?: string; templateId?: string }): Promise<SitecoreTemplate[]>;

  /** Get data source templates. */
  getDataSourceTemplates(opts?: { database?: string }): Promise<SitecoreTemplate[]>;

  /**
   * Get tenant templates for a site.
   * @param siteName - Site name
   * @param opts - Optional: database, hasPageDesign
   */
  getTenantTemplates(siteName: string, opts?: { database?: string; hasPageDesign?: boolean }): Promise<Array<{ template: SitecoreTemplate; pageDesign: { itemId: string; name: string } }>>;

  /**
   * Create a new template.
   * @param parent - Parent item ID where the template is created
   * @param name - Template name
   * @param opts - Optional: database, language, icon, baseTemplates, sections, createStandardValuesItem
   */
  createTemplate(parent: string, name: string, opts?: { database?: string; language?: string; icon?: string; baseTemplates?: string[]; sections?: any[]; createStandardValuesItem?: boolean }): Promise<SitecoreTemplate>;

  /**
   * Update an existing template.
   * @param templateId - Template ID
   * @param opts - Properties to update: name, icon, baseTemplates, sections, deleteMissingFields, etc.
   */
  updateTemplate(templateId: string, opts?: { name?: string; database?: string; language?: string; icon?: string; baseTemplates?: string[]; sections?: any[]; createStandardValuesItem?: boolean; deleteMissingFields?: boolean }): Promise<SitecoreTemplate>;

  /**
   * Delete a template.
   * @param templateId - Template ID to delete
   */
  deleteTemplate(templateId: string, opts?: { database?: string }): Promise<{ successful: boolean }>;

  /**
   * Create a template folder.
   * @param parent - Parent item ID
   * @param name - Folder name
   */
  createTemplateFolder(parent: string, name: string, opts?: { database?: string; language?: string }): Promise<SitecoreItem>;

  // ── Sites & Solutions ─────────────────────────────────

  /**
   * Get a single site by name with full details.
   * @param name - Site name
   */
  getSite(name: string): Promise<SitecoreSite>;

  /**
   * Get all sites.
   * @param includeSystem - Include system sites (default: false)
   */
  getSites(includeSystem?: boolean): Promise<Array<{ name: string; hostName: string; language: string; rootPath: string }>>;

  /** Get all site collections. */
  getSiteCollections(opts?: { database?: string }): Promise<SitecoreSiteCollection[]>;

  /**
   * Get solution sites.
   * @param opts - Optional filters: siteName, siteId, siteCollectionID, rootItemId, includeNonSxaSites
   */
  getSolutionSites(opts?: { database?: string; siteName?: string; siteId?: string; siteCollectionID?: string; rootItemId?: string; includeNonSxaSites?: boolean }): Promise<SitecoreSolutionSite[]>;

  /** Search solution sites with optional filter statement. */
  searchSolutionSites(filter?: SearchStatementInput): Promise<Array<{ siteRoot: SitecoreItem; sites: SitecoreSolutionSite[] }>>;

  /** Get solution templates. */
  getSolutionTemplates(opts?: { database?: string }): Promise<Array<{ id: string; name: string; description: string; enabled: boolean; builtInTemplate: boolean; createdBy: string; updated: string; contents: Array<{ key: string; value: any }>; siteCollection: { id: string; name: string } }>>;

  /**
   * Scaffold a new solution with site, site collection, and template.
   * @example
   * await sc.scaffoldSolution({
   *   siteName: "MySite",
   *   hostName: "mysite.com",
   *   language: "en",
   *   templateId: templateId
   * });
   */
  scaffoldSolution(input: { siteName: string; hostName: string; language: string; templateId: string; languages?: string[]; siteCollectionName?: string; siteCollectionDisplayName?: string; siteCollectionDescription?: string; siteDescription?: string; siteDisplayName?: string; posMappings?: any[]; database?: string }): Promise<{ job: SitecoreJob }>;

  /**
   * Create a site within an existing collection.
   */
  createSite(input: { siteName: string; hostName: string; language: string; templateId: string; collectionId: string; languages?: string[]; description?: string; displayName?: string; posMappings?: any[]; database?: string }): Promise<{ job: SitecoreJob }>;

  /**
   * Create a site collection.
   * @example
   * await sc.createSiteCollection({ name: "MyCollection", displayName: "My Collection" });
   */
  createSiteCollection(input: { name: string; displayName?: string; description?: string; database?: string }): Promise<{ job: SitecoreJob }>;

  /** Remove a site by ID or name. */
  removeSite(input: { siteId?: string; siteName?: string; database?: string }): Promise<{ job: SitecoreJob }>;

  /** Remove a site collection by ID. */
  removeSiteCollection(input: { id: string; database?: string }): Promise<{ job: SitecoreJob }>;

  /** Rename a site. */
  renameSite(input: { siteId?: string; siteName?: string; newName?: string; database?: string }): Promise<{ job: SitecoreJob }>;

  /** Rename a site collection. */
  renameSiteCollection(input: { id: string; name?: string; database?: string }): Promise<{ job: SitecoreJob }>;

  /** Clone a site. */
  cloneSite(input: { siteId?: string; siteName?: string; cloneName?: string; displayName?: string; description?: string; cloneSiteDefinitions?: boolean; posMappings?: any[]; database?: string }): Promise<{ job: SitecoreJob }>;

  /** Update Point of Sale mappings for sites. */
  updateSitesPos(input: { posMappingsInput: Array<{ id: string; newValue: Array<{ name: string; language: string }> }>; database?: string }): Promise<{ result: Array<{ id: string; success: boolean }> }>;

  // ── Languages & Archiving ─────────────────────────────

  /**
   * Get a single language by name.
   * @param name - Language code (e.g. "en", "fr-FR")
   */
  getLanguage(name: string): Promise<SitecoreLanguage>;

  /**
   * Get all languages.
   * @param db - Optional database name
   */
  getLanguages(db?: string): Promise<SitecoreLanguage[]>;

  /** Get all languages supported by Sitecore. */
  getSupportedLanguages(): Promise<SitecoreSupportedLanguage[]>;

  /**
   * Get the fallback language for a given language.
   * @param name - Language code
   * @param db - Optional database name
   */
  getFallbackLanguage(name: string, db?: string): Promise<SitecoreLanguage>;

  /**
   * Get a single archived item by archival ID.
   * @param archivalId - The archival ID
   * @param archiveName - Optional archive name (default: "archive")
   */
  getArchivedItem(archivalId: string, archiveName?: string): Promise<SitecoreArchivedItem>;

  /**
   * List archived items.
   * @param opts - Optional: archiveName, pageIndex, pageSize
   */
  getArchivedItems(opts?: { archiveName?: string; pageIndex?: number; pageSize?: number }): Promise<SitecoreArchivedItem[]>;

  /**
   * Add a language to the system.
   * @param input - Language details; languageCode is required
   * @example
   * await sc.addLanguage({ languageCode: "fr-FR" });
   */
  addLanguage(input: AddLanguageInput): Promise<{ successful: boolean }>;

  /**
   * Delete a language. WARNING: Removes ALL versions of this language from every item.
   * @param name - Language code to delete
   * @param db - Optional database name
   */
  deleteLanguage(name: string, db?: string): Promise<{ successful: boolean }>;

  /**
   * Delete multiple languages at once.
   * @param names - Array of language codes
   * @param db - Optional database name
   */
  deleteLanguages(names: string[], db?: string): Promise<{ successful: boolean }>;

  /**
   * Archive an item.
   * @param idOrPath - Item ID or path
   * @param archiveName - Optional archive name
   */
  archiveItem(idOrPath: string, archiveName?: string): Promise<{ archiveItemId: string }>;

  /**
   * Archive a specific version of an item.
   * @param idOrPath - Item ID or path
   * @param language - Language code
   * @param version - Version number (latest if not specified)
   * @param archiveName - Optional archive name
   */
  archiveVersion(idOrPath: string, language: string, version?: number, archiveName?: string): Promise<{ archiveVersionId: string }>;

  /**
   * Schedule an item for archiving at a future date. Pass undefined to clear the date.
   * @param idOrPath - Item ID or path
   * @param date - ISO 8601 date string, or undefined to clear
   */
  setItemArchiveDate(idOrPath: string, date?: string): Promise<{ successful: boolean }>;

  /**
   * Schedule a version for archiving at a future date.
   * @param idOrPath - Item ID or path
   * @param language - Language code
   * @param date - ISO 8601 date string, or undefined to clear
   * @param version - Version number (latest if not specified)
   */
  setVersionArchiveDate(idOrPath: string, language: string, date?: string, version?: number): Promise<{ successful: boolean }>;

  /** Restore an archived item. */
  restoreArchivedItem(archivalId: string, archiveName?: string): Promise<{ successful: boolean }>;

  /** Restore an archived version. */
  restoreArchivedVersion(versionId: string, archiveName?: string): Promise<{ successful: boolean }>;

  /** Permanently delete an archived item. */
  deleteArchivedItem(archivalId: string, archiveName?: string): Promise<{ successful: boolean }>;

  /** Permanently delete an archived version. */
  deleteArchivedVersion(versionId: string, archiveName?: string): Promise<{ successful: boolean }>;

  /** Empty the entire archive. */
  emptyArchive(archiveName?: string): Promise<{ successful: boolean }>;

  // ── Security ──────────────────────────────────────────

  /** Get the current authenticated user with profile and roles. */
  getCurrentUser(): Promise<SitecoreUser>;

  /**
   * Get a specific user by username.
   * @param userName - User name in domain\user format
   */
  getUser(userName: string): Promise<SitecoreUser>;

  /** Get all users. */
  getUsers(): Promise<SitecoreUser[]>;

  /**
   * Get a specific role with its members and memberships.
   * @param roleName - Role name in domain\role format
   */
  getRole(roleName: string): Promise<SitecoreRole>;

  /** Get all roles. */
  getRoles(): Promise<SitecoreRole[]>;

  /**
   * Get a specific security domain.
   * @param domainName - Domain name
   */
  getDomain(domainName: string): Promise<SitecoreDomain>;

  /** Get all security domains. */
  getDomains(): Promise<SitecoreDomain[]>;

  /** Get user profile selection profiles. */
  getSelectionProfiles(): Promise<Array<{ name: string; profileId: string }>>;

  /**
   * Create a new user.
   * @example
   * await sc.createUser({ userName: "sitecore\\editor1", password: "P@ss1", email: "ed@co.com" });
   */
  createUser(input: CreateUserInput): Promise<SitecoreUser>;

  /** Update user properties. Specify userName and fields to change. */
  updateUser(input: UpdateUserInput): Promise<SitecoreUser>;

  /** Delete a user. */
  deleteUser(userName: string): Promise<{ successful: boolean }>;

  /** Unlock a locked-out user. */
  unlockUser(userName: string): Promise<{ successful: boolean }>;

  /** Enable a disabled user. */
  enableUser(userName: string): Promise<{ successful: boolean }>;

  /** Disable a user. */
  disableUser(userName: string): Promise<{ successful: boolean }>;

  /** Reset user settings to defaults. */
  resetUserSettings(userName: string): Promise<{ successful: boolean }>;

  /**
   * Change a user's password.
   * @param userName - User name
   * @param oldPw - Current password
   * @param newPw - New password
   */
  changeUserPassword(userName: string, oldPw: string, newPw: string): Promise<{ successful: boolean }>;

  /**
   * Create a security domain.
   * @param domainName - Domain name
   * @param local - Whether the domain is locally managed
   */
  createDomain(domainName: string, local?: boolean): Promise<SitecoreDomain>;

  /** Delete a security domain. */
  deleteDomain(domainName: string): Promise<{ successful: boolean }>;

  /**
   * Create a security role.
   * @param roleName - Role name in domain\role format
   */
  createRole(roleName: string): Promise<SitecoreRole>;

  /** Delete a security role. */
  deleteRole(roleName: string): Promise<{ successful: boolean }>;

  /**
   * Add a role as member of parent roles.
   * @param roleName - Role to add
   * @param parentRoles - Parent roles to add it to
   */
  addRoleToRoles(roleName: string, parentRoles: string[]): Promise<{ successful: boolean }>;

  /**
   * Remove a role from parent roles.
   * @param roleName - Role to remove
   * @param parentRoles - Parent roles to remove it from
   */
  deleteRoleFromRoles(roleName: string, parentRoles: string[]): Promise<{ successful: boolean }>;

  /**
   * Add users and/or roles to a role.
   * @param roleName - The parent role
   * @param opts - Users and/or roles to add
   */
  addAccountsToRole(roleName: string, opts?: { users?: string[]; roles?: string[] }): Promise<{ successful: boolean }>;

  /**
   * Remove users and/or roles from a role.
   * @param roleName - The parent role
   * @param opts - Users and/or roles to remove
   */
  deleteAccountsFromRole(roleName: string, opts?: { users?: string[]; roles?: string[] }): Promise<{ successful: boolean }>;

  // ── Presentation & Meta ───────────────────────────────

  /**
   * Get available renderings.
   * @param opts - Optional: database, renderingId, siteRootItemId
   */
  getAvailableRenderings(opts?: { database?: string; renderingId?: string; siteRootItemId?: string }): Promise<SitecoreRendering[]>;

  /**
   * Get page designs for a site.
   * @param siteName - Site name
   */
  getPageDesigns(siteName: string, opts?: { database?: string }): Promise<Array<{ siteName: string; pageDesign: SitecoreItem }>>;

  /**
   * Get partial designs for a site.
   * @param siteName - Site name
   */
  getPartialDesigns(siteName: string, opts?: { database?: string }): Promise<Array<{ siteName: string; partialDesign: SitecoreItem }>>;

  /**
   * Get page branch roots for a site.
   * @param siteName - Site name
   */
  getPageBranchesRoots(siteName: string, opts?: { database?: string }): Promise<Array<{ siteName: string; root: SitecoreItem }>>;

  /** Get all databases. */
  getDatabases(): Promise<Array<{ name: string }>>;

  /** Get API version info. */
  getMeta(): Promise<{ version: string; xMVersion: string }>;

  /**
   * Map templates to page designs for a site.
   * @param siteName - Site name
   * @param mapping - Array of template-to-page-design mappings
   */
  configurePageDesigns(siteName: string, mapping: Array<{ templateId?: string; pageDesignId?: string }>, opts?: { database?: string }): Promise<boolean>;
}

/**
 * Sitecore XM Cloud SDK — access all 118 GraphQL operations.
 *
 * Use `Sitecore.*` or `sc.*` (shorthand alias) to call any method.
 *
 * **Categories:**
 * - Content & Items: `getItem`, `search`, `createItem`, `updateItem`, `deleteItem`, `renameItem`, `moveItem`, `copyItem`, ...
 * - Publishing: `publishItem`, `publishSite`, `getPublishingStatus`, `cancelPublishing`, ...
 * - Search Indexes: `getIndexes`, `rebuildIndexes`, `populateManagedSchema`, ...
 * - Workflows & Jobs: `getWorkflow`, `startWorkflow`, `executeWorkflowCommand`, `getJob`, ...
 * - Translation: `translatePage`, `translateSite`
 * - Templates: `getTemplate`, `createTemplate`, `updateTemplate`, `deleteTemplate`, ...
 * - Sites & Solutions: `getSite`, `createSite`, `scaffoldSolution`, `cloneSite`, ...
 * - Languages & Archiving: `getLanguages`, `addLanguage`, `archiveItem`, `restoreArchivedItem`, ...
 * - Security: `getCurrentUser`, `createUser`, `createRole`, `addAccountsToRole`, ...
 * - Presentation & Meta: `getAvailableRenderings`, `getPageDesigns`, `getMeta`, ...
 *
 * @example
 * // Get an item
 * const item = await sc.getItem("/sitecore/content/Home");
 *
 * // Search for items
 * const results = await sc.search({
 *   searchStatement: { criteria: [{ field: "_name", value: "Home", criteriaType: "CONTAINS" }] },
 *   paging: { pageSize: 10 }
 * });
 *
 * // Publish
 * const pub = await sc.publishItem({
 *   rootItemId: item.itemId,
 *   languages: ["en"],
 *   targetDatabases: ["web"],
 *   publishItemMode: "SMART"
 * });
 */
declare const Sitecore: SitecoreSDK;

/**
 * Shorthand alias for `Sitecore`. All methods are identical.
 * @see Sitecore
 */
declare const sc: SitecoreSDK;

/**
 * Print values to the Console output panel. Accepts multiple arguments.
 * @param args - Values to print (objects are JSON-serialized)
 * @example
 * print("Hello", { key: "value" });
 */
declare function print(...args: any[]): void;

/**
 * Render HTML content in the Results tab.
 * @param html - HTML string to render
 * @example
 * render(`<h1>Hello World</h1><p>This is rendered HTML.</p>`);
 */
declare function render(html: string): void;
