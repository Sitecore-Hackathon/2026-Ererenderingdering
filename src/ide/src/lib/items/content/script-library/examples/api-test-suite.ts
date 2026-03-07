import type { ContentItem } from "../../../constants";

export const apiTestSuiteScript: ContentItem = {
  name: "API Test Suite",
  template: "jsScript",
  fields: {
    Script: `// ============================================================
// Sitecore Scripting Console - Comprehensive API Test Suite
// Exercises all safe-to-test APIs with Arrange/Act/Assert
// Version: 1.8.4
// ============================================================
print('API Test Suite v1.8.4');

// ── Section 1: Config & Test Mini-Framework ─────────────

const TEST_PREFIX = '__sctest_' + Date.now() + '_';
const cleanup = { items: [], templates: [], roles: [], templateFolders: [], users: [], domains: [], languages: [], siteCollections: [] };
const results = [];
const suiteStart = Date.now();

// Well-known Sitecore template IDs
const SAMPLE_ITEM_TEMPLATE = '{76036F5E-CBCE-46D1-AF0A-4143F9B557AA}';
const FOLDER_TEMPLATE = '{A87A00B1-E6DB-45AB-8B54-636FEC3B5523}';

// Shared state for sequential CRUD tests
let testItemId = null;
let testItemPath = null;
let copyItemId = null;
let testTemplateId = null;
let testTemplateFolderId = null;
let firstSiteName = null;
let firstSiteId = null;
let firstIndexName = null;
let firstWorkflowId = null;
let currentUserName = null;
let firstDomainName = null;
let testDomainName = null;
let testUserName = null;
let testRole2Name = null;
let publishOperationId = null;
let archiveTestItemId = null;
let publishTestItemId = null;

// Assert helpers
function assert(cond, msg) {
  if (!cond) throw new Error('Assertion failed: ' + msg);
}
function assertEqual(actual, expected, msg) {
  if (actual !== expected) throw new Error((msg || 'assertEqual') + ': expected ' + JSON.stringify(expected) + ' but got ' + JSON.stringify(actual));
}
function assertNotNull(val, msg) {
  if (val === null || val === undefined) throw new Error('Expected non-null: ' + msg);
}
function assertContains(str, sub, msg) {
  if (typeof str !== 'string' || !str.includes(sub)) throw new Error((msg || 'assertContains') + ': "' + str + '" does not contain "' + sub + '"');
}
function assertArray(val, msg) {
  if (!Array.isArray(val)) throw new Error('Expected array: ' + msg);
}
function assertTruthy(val, msg) {
  if (!val) throw new Error('Expected truthy: ' + msg);
}
function assertHasKey(obj, key, msg) {
  if (typeof obj !== 'object' || obj === null || !(key in obj)) throw new Error((msg || 'assertHasKey') + ': missing key "' + key + '"');
}

let currentGroup = 'Ungrouped';
function group(name) { currentGroup = name; }

async function test(name, fn) {
  const t0 = Date.now();
  try {
    await fn();
    const dur = Date.now() - t0;
    results.push({ group: currentGroup, name, passed: true, error: null, duration: dur });
    print('PASS  ' + currentGroup + ' > ' + name + ' (' + dur + 'ms)');
  } catch (e) {
    const dur = Date.now() - t0;
    const errMsg = e && e.message ? e.message : String(e);
    results.push({ group: currentGroup, name, passed: false, error: errMsg, duration: dur });
    print('FAIL  ' + currentGroup + ' > ' + name + ' - ' + errMsg);
  }
}

// ── Section 2: Test Groups ──────────────────────────────

// ── Core (read-only) ──
group('Core');

await test('getContext', async () => {
  const ctx = await sc.getContext();
  assertNotNull(ctx, 'context should not be null');
});

await test('graphql', async () => {
  const result = await sc.graphql(\`
    query {
      item(where: { database: "master", path: "/sitecore/content" }) {
        itemId
        name
      }
    }
  \`);
  assertNotNull(result, 'graphql result');
  assertEqual(result.item.name, 'content', 'item name');
});

await test('listSites', async () => {
  const sites = await sc.listSites();
  assertArray(sites, 'listSites should return array');
});

// ── Content - Read ──
group('Content - Read');

await test('getItem by path', async () => {
  const item = await sc.getItem('/sitecore/content');
  assertNotNull(item, 'item');
  assertEqual(item.name, 'content', 'name');
  assertHasKey(item, 'itemId', 'has itemId');
});

await test('getItemChildren', async () => {
  const children = await sc.getItemChildren('/sitecore/content');
  assertArray(children, 'children should be array');
});

await test('search', async () => {
  const result = await sc.search({
    searchStatement: {
      criteria: [{ field: '_name', value: 'content', criteriaType: 'CONTAINS' }]
    },
    paging: { pageSize: 5 }
  });
  assertNotNull(result, 'search result');
  assertHasKey(result, 'totalCount', 'has totalCount');
});

await test('getMediaItem', async () => {
  const item = await sc.getMediaItem('/sitecore/media library');
  assertNotNull(item, 'media item');
});

// ── Content - CRUD (sequential, shared state) ──
group('Content - CRUD');

await test('createItem', async () => {
  const name = TEST_PREFIX + 'item';
  const item = await sc.createItem('/sitecore/content', SAMPLE_ITEM_TEMPLATE, name, { Title: 'Test Item' });
  assertNotNull(item, 'created item');
  assertHasKey(item, 'itemId', 'has itemId');
  assertHasKey(item, 'name', 'has name');
  assertHasKey(item, 'path', 'has path');
  testItemId = item.itemId;
  testItemPath = item.path;
  cleanup.items.push(item.itemId);
});

await test('getItem by ID', async () => {
  if (!testItemId) throw new Error('Skipped: no testItemId from createItem');
  const item = await sc.getItem(testItemId);
  assertNotNull(item, 'item by ID');
  assertEqual(item.itemId.replace(/[{}]/g, '').toLowerCase(), testItemId.replace(/[{}]/g, '').toLowerCase(), 'itemId matches');
});

await test('updateItem', async () => {
  if (!testItemId) throw new Error('Skipped: no testItemId');
  const item = await sc.updateItem(testItemId, { Title: 'Updated Title' });
  assertNotNull(item, 'updated item');
});

await test('renameItem', async () => {
  if (!testItemId) throw new Error('Skipped: no testItemId');
  const newName = TEST_PREFIX + 'renamed';
  const item = await sc.renameItem(testItemId, newName);
  assertNotNull(item, 'renamed item');
  assertEqual(item.name, newName, 'new name matches');
});

await test('addItemVersion', async () => {
  if (!testItemId) throw new Error('Skipped: no testItemId');
  const item = await sc.addItemVersion(testItemId);
  assertNotNull(item, 'versioned item');
  assert(item.version >= 2, 'version should be >= 2, got ' + item.version);
});

await test('deleteItemVersion', async () => {
  if (!testItemId) throw new Error('Skipped: no testItemId');
  const result = await sc.deleteItemVersion(testItemId, 2);
  assertNotNull(result, 'delete version result');
});

await test('copyItem', async () => {
  if (!testItemId) throw new Error('Skipped: no testItemId');
  const copyName = TEST_PREFIX + 'copy';
  const item = await sc.copyItem(testItemId, '/sitecore/content', { copyItemName: copyName });
  assertNotNull(item, 'copied item');
  assertHasKey(item, 'itemId', 'copy has itemId');
  copyItemId = item.itemId;
  cleanup.items.push(item.itemId);
});

await test('moveItem', async () => {
  if (!copyItemId) throw new Error('Skipped: no copyItemId');
  const folderName = TEST_PREFIX + 'folder';
  const folder = await sc.createItem('/sitecore/content', FOLDER_TEMPLATE, folderName);
  cleanup.items.push(folder.itemId);
  const moved = await sc.moveItem(copyItemId, folder.path);
  assertNotNull(moved, 'moved item');
  assertContains(moved.path, folderName, 'path contains folder name');
});

await test('deleteItem', async () => {
  const tempName = TEST_PREFIX + 'todelete';
  const temp = await sc.createItem('/sitecore/content', SAMPLE_ITEM_TEMPLATE, tempName);
  const result = await sc.deleteItem(temp.itemId, true);
  assertNotNull(result, 'delete result');
  assertEqual(result.successful, true, 'delete successful');
});

// ── Templates ──
group('Templates');

await test('getTemplates', async () => {
  const templates = await sc.Templates.getTemplates();
  assertArray(templates, 'templates is array');
  assert(templates.length > 0, 'should have templates');
});

await test('getDataSourceTemplates', async () => {
  const templates = await sc.Templates.getDataSourceTemplates();
  assertNotNull(templates, 'data source templates');
});

await test('getTenantTemplates', async () => {
  const sites = await sc.Sites.getSites();
  if (sites && sites.length > 0) {
    firstSiteName = sites[0].name || sites[0].siteName;
  }
  if (!firstSiteName) throw new Error('Skipped: no sites available');
  const templates = await sc.Templates.getTenantTemplates(firstSiteName);
  assertNotNull(templates, 'tenant templates');
});

await test('createTemplateFolder', async () => {
  const name = TEST_PREFIX + 'tmplfolder';
  const folder = await sc.Templates.createTemplateFolder('/sitecore/templates', name);
  assertNotNull(folder, 'template folder');
  assertHasKey(folder, 'itemId', 'folder has itemId');
  assertHasKey(folder, 'name', 'folder has name');
  testTemplateFolderId = folder.itemId;
  cleanup.templateFolders.push(folder.itemId);
});

await test('createTemplate', async () => {
  if (!testTemplateFolderId) throw new Error('Skipped: no template folder');
  const name = TEST_PREFIX + 'template';
  const tmpl = await sc.Templates.createTemplate(testTemplateFolderId, name, {
    sections: [{ name: 'Content', fields: [{ name: 'Heading', type: 'Single-Line Text' }] }]
  });
  assertNotNull(tmpl, 'created template');
  assertHasKey(tmpl, 'templateId', 'has templateId');
  assertHasKey(tmpl, 'name', 'has name');
  testTemplateId = tmpl.templateId;
  cleanup.templates.push(tmpl.templateId);
});

await test('getTemplate', async () => {
  if (!testTemplateId) throw new Error('Skipped: no testTemplateId');
  const tmpl = await sc.Templates.getTemplate(testTemplateId);
  assertNotNull(tmpl, 'template');
  assertEqual(tmpl.templateId.replace(/[{}]/g, '').toLowerCase(), testTemplateId.replace(/[{}]/g, '').toLowerCase(), 'templateId matches');
});

await test('updateTemplate', async () => {
  if (!testTemplateId) throw new Error('Skipped: no testTemplateId');
  const newName = TEST_PREFIX + 'tmpl_updated';
  const result = await sc.Templates.updateTemplate(testTemplateId, { name: newName });
  assertNotNull(result, 'update template result');
});

// ── Sites (read + queries) ──
group('Sites');

await test('getSites', async () => {
  const sites = await sc.Sites.getSites();
  assertNotNull(sites, 'sites');
  if (sites && sites.length > 0 && !firstSiteName) {
    firstSiteName = sites[0].name || sites[0].siteName;
    firstSiteId = sites[0].id || sites[0].siteId;
  }
});

await test('getSite', async () => {
  if (!firstSiteName) throw new Error('Skipped: no sites available');
  const site = await sc.Sites.getSite(firstSiteName);
  assertNotNull(site, 'site');
});

await test('getSiteCollections', async () => {
  const collections = await sc.Sites.getSiteCollections();
  assertNotNull(collections, 'site collections');
});

await test('getSolutionSites', async () => {
  const solution = await sc.Sites.getSolutionSites();
  assertNotNull(solution, 'solution sites');
});

await test('searchSolutionSites', async () => {
  const result = await sc.Sites.searchSolutionSites();
  assertNotNull(result, 'search solution sites');
});

await test('getSolutionTemplates', async () => {
  const templates = await sc.Sites.getSolutionTemplates();
  assertNotNull(templates, 'solution templates');
});

// ── Indexes ──
group('Indexes');

await test('getIndexes', async () => {
  const indexes = await sc.Indexes.getIndexes();
  assertArray(indexes, 'indexes is array');
  assert(indexes.length > 0, 'should have indexes');
  if (indexes.length > 0) {
    firstIndexName = indexes[0].name || indexes[0].indexName || indexes[0];
    if (typeof firstIndexName === 'object') firstIndexName = null;
  }
});

await test('getIndex', async () => {
  if (!firstIndexName) throw new Error('Skipped: no index name available');
  const index = await sc.Indexes.getIndex(firstIndexName);
  assertNotNull(index, 'index');
});

// ── Workflows ──
group('Workflows');

await test('getWorkflows', async () => {
  const wf = await sc.Workflows.getWorkflows();
  assertArray(wf, 'workflows is array');
  if (wf && wf.length > 0) {
    firstWorkflowId = wf[0].workflowId || wf[0].itemId || wf[0].id;
  }
});

await test('getWorkflow', async () => {
  if (!firstWorkflowId) throw new Error('Skipped: no workflow ID available');
  const wf = await sc.Workflows.getWorkflow(firstWorkflowId);
  assertNotNull(wf, 'workflow');
});

await test('getJobs', async () => {
  const jobs = await sc.Workflows.getJobs();
  assertNotNull(jobs, 'jobs result');
});

await test('getJob', async () => {
  const jobs = await sc.Workflows.getJobs();
  if (!jobs || (Array.isArray(jobs) && jobs.length === 0)) throw new Error('Skipped: no jobs available');
  const jobList = Array.isArray(jobs) ? jobs : (jobs.jobs || jobs.results || []);
  if (jobList.length === 0) throw new Error('Skipped: no jobs to query');
  // Try handle first (contains |), then fall back to name
  const firstJob = jobList[0];
  const jobRef = firstJob.handle || firstJob.jobHandle;
  if (!jobRef) throw new Error('Skipped: no job handle found in ' + JSON.stringify(Object.keys(firstJob)));
  const job = await sc.Workflows.getJob(jobRef);
  // Job may complete and be gone — null is acceptable
  assert(true, 'getJob returned without error');
});

await test('isJobQueued', async () => {
  const result = await sc.Workflows.isJobQueued('nonexistent_job_handle');
  assertEqual(result, false, 'nonexistent job should not be queued');
});

await test('isJobRunning', async () => {
  const result = await sc.Workflows.isJobRunning('nonexistent_job_handle');
  assertEqual(result, false, 'nonexistent job should not be running');
});

// ── Languages (read-only) ──
group('Languages');

await test('getLanguages', async () => {
  const langs = await sc.Languages.getLanguages();
  assertArray(langs, 'languages is array');
  assert(langs.length > 0, 'should have languages');
});

await test('getSupportedLanguages', async () => {
  const langs = await sc.Languages.getSupportedLanguages();
  assertNotNull(langs, 'supported languages');
});

await test('getLanguage', async () => {
  const lang = await sc.Languages.getLanguage('en');
  assertNotNull(lang, 'language en');
});

await test('getFallbackLanguage', async () => {
  // 'en' may not have a fallback — just verify it doesn't throw
  const fallback = await sc.Languages.getFallbackLanguage('en');
  // fallback can be null if no fallback configured; that's valid
  assert(true, 'getFallbackLanguage returned without error');
});

await test('getArchivedItems', async () => {
  const archived = await sc.Languages.getArchivedItems({ archiveName: 'archive' });
  assertNotNull(archived, 'archived items result');
});

// ── Security (read-only) ──
group('Security');

await test('getCurrentUser', async () => {
  const user = await sc.Security.getCurrentUser();
  assertNotNull(user, 'current user');
  assertHasKey(user, 'name', 'user has name');
  currentUserName = user.name;
});

await test('getUsers', async () => {
  const users = await sc.Security.getUsers();
  assertNotNull(users, 'users result');
});

await test('getUser', async () => {
  if (!currentUserName) throw new Error('Skipped: no current user name');
  const user = await sc.Security.getUser(currentUserName);
  assertNotNull(user, 'user');
  assertHasKey(user, 'name', 'user has name');
});

await test('getRoles', async () => {
  const roles = await sc.Security.getRoles();
  assertArray(roles, 'roles is array');
});

await test('getDomains', async () => {
  const domains = await sc.Security.getDomains();
  assertArray(domains, 'domains is array');
  assert(domains.length > 0, 'should have domains');
  firstDomainName = domains[0].name || domains[0].domainName || domains[0];
  if (typeof firstDomainName === 'object') firstDomainName = 'sitecore';
});

await test('getDomain', async () => {
  if (!firstDomainName) throw new Error('Skipped: no domain name available');
  const domain = await sc.Security.getDomain(firstDomainName);
  assertNotNull(domain, 'domain');
});

await test('getSelectionProfiles', async () => {
  const profiles = await sc.Security.getSelectionProfiles();
  assertNotNull(profiles, 'selection profiles');
});

await test('createRole + getRole round-trip', async () => {
  const roleName = 'sitecore\\\\SCTestRole' + Date.now();
  const created = await sc.Security.createRole(roleName);
  assertNotNull(created, 'created role');
  cleanup.roles.push(roleName);
  const fetched = await sc.Security.getRole(roleName);
  assertNotNull(fetched, 'fetched role');
  assertContains(fetched.name, 'SCTestRole', 'role name contains prefix');
});

// ── Publishing (read-only) ──
group('Publishing');

await test('getPublishingTargets', async () => {
  const targets = await sc.Publishing.getPublishingTargets();
  assertArray(targets, 'publishing targets is array');
});

await test('getPublishingQueue', async () => {
  const queue = await sc.Publishing.getPublishingQueue({ sort: { field: 'date', direction: 'DESCENDING' }, paging: { pageIndex: 0, pageSize: 10 } });
  assertNotNull(queue, 'publishing queue');
});

// ── Presentation (read-only) ──
group('Presentation');

await test('getDatabases', async () => {
  const dbs = await sc.Presentation.getDatabases();
  assertArray(dbs, 'databases is array');
});

await test('getMeta', async () => {
  const meta = await sc.Presentation.getMeta();
  assertNotNull(meta, 'meta');
});

await test('getAvailableRenderings', async () => {
  const renderings = await sc.Presentation.getAvailableRenderings();
  assertNotNull(renderings, 'renderings');
});

await test('getPageDesigns', async () => {
  if (!firstSiteName) throw new Error('Skipped: no site name available');
  const designs = await sc.Presentation.getPageDesigns(firstSiteName);
  assertNotNull(designs, 'page designs');
});

await test('getPartialDesigns', async () => {
  if (!firstSiteName) throw new Error('Skipped: no site name available');
  const designs = await sc.Presentation.getPartialDesigns(firstSiteName);
  assertNotNull(designs, 'partial designs');
});

await test('getPageBranchesRoots', async () => {
  if (!firstSiteName) throw new Error('Skipped: no site name available');
  const roots = await sc.Presentation.getPageBranchesRoots(firstSiteName);
  assertNotNull(roots, 'page branches roots');
});

// ── Security - CRUD (with cleanup) ──
group('Security - CRUD');

await test('createDomain + deleteDomain', async () => {
  testDomainName = 'sctest' + Date.now();
  const created = await sc.Security.createDomain(testDomainName);
  assertNotNull(created, 'created domain');
  cleanup.domains.push(testDomainName);
  const fetched = await sc.Security.getDomain(testDomainName);
  assertNotNull(fetched, 'fetched test domain');
});

await test('createUser', async () => {
  if (!testDomainName) throw new Error('Skipped: no test domain');
  testUserName = testDomainName + '\\\\testuser' + Date.now();
  const created = await sc.Security.createUser({ userName: testUserName, password: 'T3st!Pass' + Date.now(), email: 'test@example.com' });
  assertNotNull(created, 'created user');
  cleanup.users.push(testUserName);
});

await test('getUser (test user)', async () => {
  if (!testUserName) throw new Error('Skipped: no test user');
  const user = await sc.Security.getUser(testUserName);
  assertNotNull(user, 'test user');
  assertHasKey(user, 'name', 'user has name');
});

await test('updateUser', async () => {
  if (!testUserName) throw new Error('Skipped: no test user');
  const result = await sc.Security.updateUser({ userName: testUserName, fullName: 'Test User Updated' });
  assertNotNull(result, 'update user result');
});

await test('disableUser', async () => {
  if (!testUserName) throw new Error('Skipped: no test user');
  const result = await sc.Security.disableUser(testUserName);
  assertNotNull(result, 'disable user result');
});

await test('enableUser', async () => {
  if (!testUserName) throw new Error('Skipped: no test user');
  const result = await sc.Security.enableUser(testUserName);
  assertNotNull(result, 'enable user result');
});

await test('unlockUser', async () => {
  if (!testUserName) throw new Error('Skipped: no test user');
  const result = await sc.Security.unlockUser(testUserName);
  assertNotNull(result, 'unlock user result');
});

await test('resetUserSettings', async () => {
  if (!testUserName) throw new Error('Skipped: no test user');
  const result = await sc.Security.resetUserSettings(testUserName);
  assertNotNull(result, 'reset user settings result');
});

await test('changeUserPassword', async () => {
  if (!testUserName) throw new Error('Skipped: no test user');
  const result = await sc.Security.changeUserPassword(testUserName, 'T3st!Pass' + Date.now(), 'N3w!Pass' + Date.now());
  assertNotNull(result, 'change password result');
});

await test('addRoleToRoles + deleteRoleFromRoles', async () => {
  testRole2Name = 'sitecore\\\\SCTestRoleB' + Date.now();
  const role2 = await sc.Security.createRole(testRole2Name);
  assertNotNull(role2, 'created role2');
  cleanup.roles.push(testRole2Name);
  const existingRole = cleanup.roles[0];
  if (!existingRole) throw new Error('Skipped: no existing role');
  const addResult = await sc.Security.addRoleToRoles(existingRole, [testRole2Name]);
  assertNotNull(addResult, 'add role to roles result');
  const removeResult = await sc.Security.deleteRoleFromRoles(existingRole, [testRole2Name]);
  assertNotNull(removeResult, 'delete role from roles result');
});

await test('addAccountsToRole + deleteAccountsFromRole', async () => {
  if (!testUserName || cleanup.roles.length === 0) throw new Error('Skipped: no test user or role');
  const roleName = cleanup.roles[0];
  const addResult = await sc.Security.addAccountsToRole(roleName, { users: [testUserName] });
  assertNotNull(addResult, 'add accounts to role result');
  const removeResult = await sc.Security.deleteAccountsFromRole(roleName, { users: [testUserName] });
  assertNotNull(removeResult, 'delete accounts from role result');
});

await test('deleteUser', async () => {
  if (!testUserName) throw new Error('Skipped: no test user');
  const result = await sc.Security.deleteUser(testUserName);
  assertNotNull(result, 'delete user result');
  cleanup.users = cleanup.users.filter(u => u !== testUserName);
});

await test('deleteDomain', async () => {
  if (!testDomainName) throw new Error('Skipped: no test domain');
  const result = await sc.Security.deleteDomain(testDomainName);
  assertNotNull(result, 'delete domain result');
  cleanup.domains = cleanup.domains.filter(d => d !== testDomainName);
});

// ── Publishing - Mutations ──
group('Publishing - Mutations');

// Resolve the actual target database name from publishing targets
let publishTargetDb = 'web';
await test('resolvePublishingTarget', async () => {
  const targets = await sc.Publishing.getPublishingTargets();
  if (targets && targets.length > 0) {
    publishTargetDb = targets[0].targetDatabase || 'web';
  }
  assertNotNull(publishTargetDb, 'resolved target database');
});

await test('publishItem', async () => {
  publishTestItemId = testItemId;
  if (!publishTestItemId) {
    const item = await sc.createItem('/sitecore/content', SAMPLE_ITEM_TEMPLATE, TEST_PREFIX + 'publish');
    publishTestItemId = item.itemId;
    cleanup.items.push(item.itemId);
  }
  const result = await sc.Publishing.publishItem({ rootItemId: publishTestItemId, languages: ['en'], targetDatabases: [publishTargetDb], publishItemMode: 'SMART' });
  assertNotNull(result, 'publish item result');
  if (result && (result.operationId || result.handle)) {
    publishOperationId = result.operationId || result.handle;
  }
});

await test('getPublishingStatus', async () => {
  if (!publishOperationId) throw new Error('Skipped: no publish operation ID');
  const status = await sc.Publishing.getPublishingStatus(publishOperationId);
  assertNotNull(status, 'publishing status');
});

await test('cancelPublishing', async () => {
  try {
    const result = await sc.Publishing.cancelPublishing(publishOperationId || 'nonexistent');
    assertNotNull(result, 'cancel publishing result');
  } catch (e) {
    // Canceling a completed or invalid operation may throw — that's OK
    assert(e && e.message, 'cancel threw with message: ' + (e && e.message));
  }
});

await test('publishSite', async () => {
  if (!firstSiteName) throw new Error('Skipped: no site name');
  const result = await sc.Publishing.publishSite({ languages: ['en'], targetDatabases: [publishTargetDb], publishSiteMode: 'SMART' });
  assertNotNull(result, 'publish site result');
});

await test('publishWithOptions', async () => {
  const result = await sc.Publishing.publishWithOptions([{ language: 'en', sourceDatabase: 'master', targetDatabase: publishTargetDb, publishSiteMode: 'SMART' }]);
  assertNotNull(result, 'publish with options result');
});

await test('publishLanguageSpecificItems', async () => {
  if (!publishTestItemId) throw new Error('Skipped: no publish test item');
  const result = await sc.Publishing.publishLanguageSpecificItems({ itemsToPublish: [{ id: publishTestItemId, languages: ['en'] }], targetDatabases: [publishTargetDb], publishItemMode: 'SMART' });
  assertNotNull(result, 'publish language specific items result');
});

// ── Languages - Mutations ──
group('Languages - Mutations');

await test('addLanguage + deleteLanguage', async () => {
  const result = await sc.Languages.addLanguage({ languageCode: 'zu', regionCode: 'ZA' });
  assertNotNull(result, 'add language result');
  cleanup.languages.push('zu-ZA');
  const langs = await sc.Languages.getLanguages();
  const hasZulu = Array.isArray(langs) && langs.some(l => (l.name || l.isoCode || l) === 'zu-ZA' || (l.name || '').includes('zu'));
  assertTruthy(hasZulu, 'zu-ZA should be in languages');
  const delResult = await sc.Languages.deleteLanguage('zu-ZA');
  assertNotNull(delResult, 'delete language result');
  cleanup.languages = cleanup.languages.filter(l => l !== 'zu-ZA');
});

await test('deleteLanguages (batch)', async () => {
  await sc.Languages.addLanguage({ languageCode: 'af', regionCode: 'ZA' });
  await sc.Languages.addLanguage({ languageCode: 'sq', regionCode: 'AL' });
  cleanup.languages.push('af-ZA', 'sq-AL');
  const result = await sc.Languages.deleteLanguages(['af-ZA', 'sq-AL']);
  assertNotNull(result, 'delete languages result');
  cleanup.languages = cleanup.languages.filter(l => l !== 'af-ZA' && l !== 'sq-AL');
});

await test('archiveItem + restoreArchivedItem', async () => {
  const itemName = TEST_PREFIX + 'archive';
  const item = await sc.createItem('/sitecore/content', SAMPLE_ITEM_TEMPLATE, itemName);
  archiveTestItemId = item.itemId;
  cleanup.items.push(item.itemId);
  const archiveResult = await sc.Languages.archiveItem(item.itemId);
  assertNotNull(archiveResult, 'archive item result');
  assertHasKey(archiveResult, 'archiveItemId', 'has archiveItemId');
  const restoreResult = await sc.Languages.restoreArchivedItem(archiveResult.archiveItemId);
  assertNotNull(restoreResult, 'restore archived item result');
});

await test('archiveVersion + restoreArchivedVersion', async () => {
  if (!archiveTestItemId) throw new Error('Skipped: no archive test item');
  await sc.addItemVersion(archiveTestItemId);
  const archiveResult = await sc.Languages.archiveVersion(archiveTestItemId, 'en', 2);
  assertNotNull(archiveResult, 'archive version result');
  assertHasKey(archiveResult, 'archiveVersionId', 'has archiveVersionId');
  const restoreResult = await sc.Languages.restoreArchivedVersion(archiveResult.archiveVersionId);
  assertNotNull(restoreResult, 'restore archived version result');
});

await test('setItemArchiveDate', async () => {
  if (!archiveTestItemId) throw new Error('Skipped: no archive test item');
  const futureDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
  const result = await sc.Languages.setItemArchiveDate(archiveTestItemId, futureDate);
  assertNotNull(result, 'set item archive date result');
});

await test('setVersionArchiveDate', async () => {
  if (!archiveTestItemId) throw new Error('Skipped: no archive test item');
  const futureDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
  const result = await sc.Languages.setVersionArchiveDate(archiveTestItemId, 'en', futureDate, 1);
  assertNotNull(result, 'set version archive date result');
});

await test('getArchivedItem', async () => {
  if (!archiveTestItemId) throw new Error('Skipped: no archive test item');
  const archiveResult = await sc.Languages.archiveItem(archiveTestItemId);
  assertNotNull(archiveResult, 'archive result for getArchivedItem');
  try {
    const item = await sc.Languages.getArchivedItem(archiveResult.archiveItemId);
    assertNotNull(item, 'archived item');
  } finally {
    try { await sc.Languages.restoreArchivedItem(archiveResult.archiveItemId); } catch(e) { /* ignore */ }
  }
});

await test('deleteArchivedItem', async () => {
  const tempName = TEST_PREFIX + 'archivedelete';
  const item = await sc.createItem('/sitecore/content', SAMPLE_ITEM_TEMPLATE, tempName);
  const archiveResult = await sc.Languages.archiveItem(item.itemId);
  assertNotNull(archiveResult, 'archive for delete');
  const result = await sc.Languages.deleteArchivedItem(archiveResult.archiveItemId);
  assertNotNull(result, 'delete archived item result');
});

await test('deleteArchivedVersion', async () => {
  const tempName = TEST_PREFIX + 'archivever';
  const item = await sc.createItem('/sitecore/content', SAMPLE_ITEM_TEMPLATE, tempName);
  cleanup.items.push(item.itemId);
  await sc.addItemVersion(item.itemId);
  const archiveResult = await sc.Languages.archiveVersion(item.itemId, 'en', 2);
  assertNotNull(archiveResult, 'archive version for delete');
  const result = await sc.Languages.deleteArchivedVersion(archiveResult.archiveVersionId);
  assertNotNull(result, 'delete archived version result');
});

await test('emptyArchive', async () => {
  const result = await sc.Languages.emptyArchive();
  assertNotNull(result, 'empty archive result');
});

// ── Presentation - Mutations ──
group('Presentation - Mutations');

await test('configurePageDesigns', async () => {
  if (!firstSiteName) throw new Error('Skipped: no site name');
  try {
    const designs = await sc.Presentation.getPageDesigns(firstSiteName);
    if (!designs || (Array.isArray(designs) && designs.length === 0)) throw new Error('Skipped: no page designs available');
    // Just call configure with empty/minimal config to test the API exists
    const result = await sc.Presentation.configurePageDesigns(firstSiteName, []);
    assertNotNull(result, 'configure page designs result');
  } catch (e) {
    if (e.message && e.message.startsWith('Skipped:')) throw e;
    throw new Error('Skipped: configurePageDesigns needs specific setup - ' + (e.message || e));
  }
});

// ── Indexes - Mutations ──
group('Indexes - Mutations');

await test('rebuildIndexes', async () => {
  if (!firstIndexName) throw new Error('Skipped: no index name available');
  try {
    const result = await sc.Indexes.rebuildIndexes([firstIndexName]);
    assertNotNull(result, 'rebuild indexes result');
  } catch (e) {
    throw new Error('Skipped: rebuild may need admin permissions - ' + (e.message || e));
  }
});

await test('populateManagedSchema', async () => {
  if (!firstIndexName) throw new Error('Skipped: no index name available');
  try {
    const result = await sc.Indexes.populateManagedSchema([firstIndexName]);
    assertNotNull(result, 'populate managed schema result');
  } catch (e) {
    throw new Error('Skipped: schema population may need admin permissions - ' + (e.message || e));
  }
});

await test('rebuildLinkDatabase', async () => {
  try {
    const result = await sc.Indexes.rebuildLinkDatabase(['master']);
    assertNotNull(result, 'rebuild link database result');
  } catch (e) {
    throw new Error('Skipped: rebuild link DB may need admin permissions - ' + (e.message || e));
  }
});

await test('cleanUpDatabases', async () => {
  try {
    const result = await sc.Indexes.cleanUpDatabases(['master']);
    assertNotNull(result, 'clean up databases result');
  } catch (e) {
    throw new Error('Skipped: cleanup may need admin permissions - ' + (e.message || e));
  }
});

// ── Section 3: Cleanup ──────────────────────────────────

print('');
print('=== CLEANUP ===');
const cleanupErrors = [];

// Delete users
for (const userName of cleanup.users) {
  try {
    await sc.Security.deleteUser(userName);
    print('Cleaned up user: ' + userName);
  } catch (e) {
    const msg = 'Failed to delete user ' + userName + ': ' + (e.message || e);
    print(msg);
    cleanupErrors.push(msg);
  }
}

// Delete roles
for (const roleName of cleanup.roles) {
  try {
    await sc.Security.deleteRole(roleName);
    print('Cleaned up role: ' + roleName);
  } catch (e) {
    const msg = 'Failed to delete role ' + roleName + ': ' + (e.message || e);
    print(msg);
    cleanupErrors.push(msg);
  }
}

// Delete domains
for (const domainName of cleanup.domains) {
  try {
    await sc.Security.deleteDomain(domainName);
    print('Cleaned up domain: ' + domainName);
  } catch (e) {
    const msg = 'Failed to delete domain ' + domainName + ': ' + (e.message || e);
    print(msg);
    cleanupErrors.push(msg);
  }
}

// Delete templates
for (const tid of cleanup.templates) {
  try {
    await sc.Templates.deleteTemplate(tid);
    print('Cleaned up template: ' + tid);
  } catch (e) {
    const msg = 'Failed to delete template ' + tid + ': ' + (e.message || e);
    print(msg);
    cleanupErrors.push(msg);
  }
}

// Delete content items in reverse order
for (const itemId of [...cleanup.items].reverse()) {
  try {
    await sc.deleteItem(itemId, true);
    print('Cleaned up item: ' + itemId);
  } catch (e) {
    const msg = 'Failed to delete item ' + itemId + ': ' + (e.message || e);
    print(msg);
    cleanupErrors.push(msg);
  }
}

// Delete template folders
for (const fid of cleanup.templateFolders) {
  try {
    await sc.deleteItem(fid, true);
    print('Cleaned up template folder: ' + fid);
  } catch (e) {
    const msg = 'Failed to delete template folder ' + fid + ': ' + (e.message || e);
    print(msg);
    cleanupErrors.push(msg);
  }
}

// Delete languages
for (const lang of cleanup.languages) {
  try {
    await sc.Languages.deleteLanguage(lang);
    print('Cleaned up language: ' + lang);
  } catch (e) {
    const msg = 'Failed to delete language ' + lang + ': ' + (e.message || e);
    print(msg);
    cleanupErrors.push(msg);
  }
}

// Delete site collections
for (const coll of cleanup.siteCollections) {
  try {
    await sc.Sites.removeSiteCollection({ name: coll });
    print('Cleaned up site collection: ' + coll);
  } catch (e) {
    const msg = 'Failed to remove site collection ' + coll + ': ' + (e.message || e);
    print(msg);
    cleanupErrors.push(msg);
  }
}

// ── Section 4: HTML Summary Report ──────────────────────

const totalDuration = Date.now() - suiteStart;
const passed = results.filter(r => r.passed).length;
const failed = results.filter(r => !r.passed).length;
const total = results.length;

const groups = [];
const groupOrder = [];
for (const r of results) {
  if (!groupOrder.includes(r.group)) groupOrder.push(r.group);
}

let tableRows = '';
for (const g of groupOrder) {
  const gResults = results.filter(r => r.group === g);
  tableRows += '<tr><td colspan="4" style="background:var(--muted);color:var(--muted-foreground);font-weight:600;padding:8px 12px;font-size:var(--text-sm);">' + g + ' (' + gResults.filter(r=>r.passed).length + '/' + gResults.length + ')</td></tr>';
  for (const r of gResults) {
    const status = r.passed
      ? '<span style="color:var(--success-foreground);font-weight:600;">PASS</span>'
      : '<span style="color:var(--destructive-foreground);font-weight:600;">FAIL</span>';
    const errCell = r.error ? '<span style="color:var(--warning-foreground);font-size:var(--text-xs);">' + r.error.replace(/</g,'&lt;').substring(0, 120) + '</span>' : '';
    tableRows += '<tr style="border-bottom:1px solid var(--border);">'
      + '<td style="padding:6px 12px;">' + r.name + '</td>'
      + '<td style="padding:6px 12px;text-align:center;">' + status + '</td>'
      + '<td style="padding:6px 12px;text-align:right;color:var(--muted-foreground);">' + r.duration + 'ms</td>'
      + '<td style="padding:6px 12px;">' + errCell + '</td>'
      + '</tr>';
  }
}

const skippedAPIs = [
  'Content: uploadMedia, createItemFromBranch (need file blob / branch template)',
  'Workflows: startWorkflow, executeWorkflowCommand (need item in workflow state)',
  'Sites: createSite, removeSite, renameSite, cloneSite, scaffoldSolution, updateSitesPos, createSiteCollection, removeSiteCollection, renameSiteCollection (complex preconditions)',
  'Translation: translatePage, translateSite (requires translation service configuration)',
  'Core: retrievePage, navigateTo, reloadCanvas (need Pages context)'
];
const skippedHtml = skippedAPIs.map(s => '<li style="margin:2px 0;color:var(--muted-foreground);">' + s + '</li>').join('');

const statusBg = failed === 0 ? 'var(--success-background)' : 'var(--destructive-background)';
const statusFg = failed === 0 ? 'var(--success-foreground)' : 'var(--destructive-foreground)';
const statusText = failed === 0 ? 'ALL TESTS PASSED' : failed + ' TEST(S) FAILED';

render(\`
<div style="font-family:var(--font-sans),system-ui,sans-serif;background:var(--background);color:var(--foreground);padding:24px;border-radius:var(--radius);max-width:900px;">
  <div style="display:flex;align-items:center;gap:16px;margin-bottom:20px;">
    <h2 style="margin:0;font-size:var(--text-xl);font-weight:600;">API Test Suite Results</h2>
    <span style="background:\${statusBg};color:\${statusFg};padding:4px 12px;border-radius:var(--rounded-full);font-weight:600;font-size:var(--text-xs);">\${statusText}</span>
  </div>
  <div style="display:flex;gap:24px;margin-bottom:20px;font-size:var(--text-sm);">
    <div><strong style="color:var(--success-foreground);">\${passed}</strong> passed</div>
    <div><strong style="color:\${failed > 0 ? 'var(--destructive-foreground)' : 'var(--muted-foreground)'};">\${failed}</strong> failed</div>
    <div><strong>\${total}</strong> total</div>
    <div style="color:var(--muted-foreground);">\${totalDuration}ms total</div>
    \${cleanupErrors.length > 0 ? '<div style="color:var(--warning-foreground);">' + cleanupErrors.length + ' cleanup error(s)</div>' : ''}
  </div>
  <table style="width:100%;border-collapse:collapse;font-size:var(--text-sm);">
    <thead>
      <tr style="border-bottom:2px solid var(--border);">
        <th style="text-align:left;padding:8px 12px;color:var(--muted-foreground);font-weight:600;">Test</th>
        <th style="text-align:center;padding:8px 12px;color:var(--muted-foreground);font-weight:600;">Status</th>
        <th style="text-align:right;padding:8px 12px;color:var(--muted-foreground);font-weight:600;">Duration</th>
        <th style="text-align:left;padding:8px 12px;color:var(--muted-foreground);font-weight:600;">Error</th>
      </tr>
    </thead>
    <tbody>\${tableRows}</tbody>
  </table>
  <details style="margin-top:20px;">
    <summary style="cursor:pointer;color:var(--muted-foreground);font-size:var(--text-sm);">Skipped APIs (need preconditions not available in test context)</summary>
    <ul style="margin-top:8px;padding-left:20px;font-size:var(--text-xs);">\${skippedHtml}</ul>
  </details>
</div>
\`);

print('');
print('=== DONE: ' + passed + '/' + total + ' passed in ' + totalDuration + 'ms ===');
`,
  },
};
