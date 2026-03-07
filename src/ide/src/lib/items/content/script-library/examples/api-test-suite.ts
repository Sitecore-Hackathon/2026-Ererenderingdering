import type { ContentItem } from "../../../constants";

export const apiTestSuiteScript: ContentItem = {
  name: "API Test Suite",
  template: "jsScript",
  fields: {
    Script: `// ============================================================
// Sitecore Scripting Console - Comprehensive API Test Suite
// Exercises all safe-to-test APIs with Arrange/Act/Assert
// ============================================================

// ── Section 1: Config & Test Mini-Framework ─────────────

const TEST_PREFIX = '__sctest_' + Date.now() + '_';
const cleanup = { items: [], templates: [], roles: [], templateFolders: [] };
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

// ── Publishing (read-only) ──
group('Publishing');

await test('getPublishingTargets', async () => {
  const targets = await sc.Publishing.getPublishingTargets();
  assertArray(targets, 'publishing targets is array');
});

// ── Indexes (read-only) ──
group('Indexes');

await test('getIndexes', async () => {
  const indexes = await sc.Indexes.getIndexes();
  assertArray(indexes, 'indexes is array');
  assert(indexes.length > 0, 'should have indexes');
});

// ── Workflows (read-only) ──
group('Workflows');

await test('getWorkflows', async () => {
  const wf = await sc.Workflows.getWorkflows();
  assertArray(wf, 'workflows is array');
});

await test('getJobs', async () => {
  const jobs = await sc.Workflows.getJobs();
  assertNotNull(jobs, 'jobs result');
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

// ── Security ──
group('Security');

await test('getCurrentUser', async () => {
  const user = await sc.Security.getCurrentUser();
  assertNotNull(user, 'current user');
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
});

await test('createRole + getRole round-trip', async () => {
  const roleName = 'sitecore\\\\' + TEST_PREFIX + 'role';
  const created = await sc.Security.createRole(roleName);
  assertNotNull(created, 'created role');
  cleanup.roles.push(roleName);
  const fetched = await sc.Security.getRole(roleName);
  assertNotNull(fetched, 'fetched role');
  assertContains(fetched.name, TEST_PREFIX, 'role name contains prefix');
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

// ── Sites (read-only) ──
group('Sites');

await test('getSites', async () => {
  const sites = await sc.Sites.getSites();
  assertNotNull(sites, 'sites');
});

await test('getSiteCollections', async () => {
  const collections = await sc.Sites.getSiteCollections();
  assertNotNull(collections, 'site collections');
});

await test('getSolutionSites', async () => {
  const solution = await sc.Sites.getSolutionSites();
  assertNotNull(solution, 'solution sites');
});

// ── Section 3: Cleanup ──────────────────────────────────

print('');
print('=== CLEANUP ===');
const cleanupErrors = [];

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
  tableRows += '<tr><td colspan="4" style="background:#1e293b;color:#94a3b8;font-weight:bold;padding:8px 12px;font-size:13px;">' + g + ' (' + gResults.filter(r=>r.passed).length + '/' + gResults.length + ')</td></tr>';
  for (const r of gResults) {
    const status = r.passed
      ? '<span style="color:#22c55e;font-weight:bold;">PASS</span>'
      : '<span style="color:#ef4444;font-weight:bold;">FAIL</span>';
    const errCell = r.error ? '<span style="color:#fbbf24;font-size:12px;">' + r.error.replace(/</g,'&lt;').substring(0, 120) + '</span>' : '';
    tableRows += '<tr style="border-bottom:1px solid #334155;">'
      + '<td style="padding:6px 12px;">' + r.name + '</td>'
      + '<td style="padding:6px 12px;text-align:center;">' + status + '</td>'
      + '<td style="padding:6px 12px;text-align:right;">' + r.duration + 'ms</td>'
      + '<td style="padding:6px 12px;">' + errCell + '</td>'
      + '</tr>';
  }
}

const skippedAPIs = [
  'Core: retrievePage, reloadCanvas, navigateTo',
  'Content: createItemFromBranch, getMediaItem, uploadMedia, deleteItemVersion',
  'Publishing: publishItem, publishSite, publishWithOptions, publishLanguageSpecificItems, cancelPublishing, getPublishingStatus, getPublishingQueue',
  'Indexes: getIndex, rebuildIndexes, populateManagedSchema, rebuildLinkDatabase, cleanUpDatabases',
  'Workflows: getWorkflow, getJob, isJobQueued, isJobRunning, startWorkflow, executeWorkflowCommand',
  'Translation: translatePage, translateSite',
  'Languages: all mutations & archiving (addLanguage, deleteLanguage, archiveItem, etc.)',
  'Security: user CRUD, domain CRUD, role membership mutations',
  'Presentation: configurePageDesigns, getPageDesigns, getPartialDesigns, getPageBranchesRoots (need site name)',
  'Sites: scaffoldSolution, createSite, createSiteCollection, removeSite, removeSiteCollection, renameSite, renameSiteCollection, cloneSite, updateSitesPos'
];
const skippedHtml = skippedAPIs.map(s => '<li style="margin:2px 0;color:#94a3b8;">' + s + '</li>').join('');

const statusColor = failed === 0 ? '#22c55e' : '#ef4444';
const statusText = failed === 0 ? 'ALL TESTS PASSED' : failed + ' TEST(S) FAILED';

render(\`
<div style="font-family:system-ui,-apple-system,sans-serif;background:#0f172a;color:#e2e8f0;padding:24px;border-radius:12px;max-width:900px;">
  <div style="display:flex;align-items:center;gap:16px;margin-bottom:20px;">
    <h2 style="margin:0;font-size:20px;">API Test Suite Results</h2>
    <span style="background:\${statusColor};color:#0f172a;padding:4px 12px;border-radius:6px;font-weight:bold;font-size:13px;">\${statusText}</span>
  </div>
  <div style="display:flex;gap:24px;margin-bottom:20px;font-size:14px;">
    <div><strong style="color:#22c55e;">\${passed}</strong> passed</div>
    <div><strong style="color:\${failed > 0 ? '#ef4444' : '#94a3b8'};">\${failed}</strong> failed</div>
    <div><strong>\${total}</strong> total</div>
    <div style="color:#94a3b8;">\${totalDuration}ms total</div>
    \${cleanupErrors.length > 0 ? '<div style="color:#fbbf24;">' + cleanupErrors.length + ' cleanup error(s)</div>' : ''}
  </div>
  <table style="width:100%;border-collapse:collapse;font-size:13px;">
    <thead>
      <tr style="border-bottom:2px solid #334155;">
        <th style="text-align:left;padding:8px 12px;">Test</th>
        <th style="text-align:center;padding:8px 12px;">Status</th>
        <th style="text-align:right;padding:8px 12px;">Duration</th>
        <th style="text-align:left;padding:8px 12px;">Error</th>
      </tr>
    </thead>
    <tbody>\${tableRows}</tbody>
  </table>
  <details style="margin-top:20px;">
    <summary style="cursor:pointer;color:#94a3b8;font-size:13px;">Skipped APIs (destructive/expensive/need preconditions)</summary>
    <ul style="margin-top:8px;padding-left:20px;font-size:12px;">\${skippedHtml}</ul>
  </details>
</div>
\`);

print('');
print('=== DONE: ' + passed + '/' + total + ' passed in ' + totalDuration + 'ms ===');
`,
  },
};
