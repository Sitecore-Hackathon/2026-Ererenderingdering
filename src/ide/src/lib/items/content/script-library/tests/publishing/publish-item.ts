import type { ContentItem } from "../../../../constants";

export const publishItemTest: ContentItem = {
  name: "publishItem",
  template: "jsScript",
  fields: {
    "__Display name": "Publish Item",
    Script: `// Test: Publishing > publishItem
const t0 = Date.now();
let passed = false;
let error = null;

try {
  const SAMPLE_TEMPLATE = '{76036F5E-CBCE-46D1-AF0A-4143F9B557AA}';
  const name = '__sctest_' + Date.now() + '_publish';
  const item = await sc.createItem('/sitecore/content', SAMPLE_TEMPLATE, name);
  try {
    if (!item || !item.itemId) throw new Error('setup failed');
    const targets = await sc.Publishing.getPublishingTargets();
    const targetDb = (targets && targets.length > 0) ? (targets[0].targetDatabase || 'web') : 'web';
    const result = await sc.Publishing.publishItem({ rootItemId: item.itemId, languages: ['en'], targetDatabases: [targetDb], publishItemMode: 'SMART' });
    if (!result) throw new Error('publish item result is null');
  } finally {
    try { await sc.deleteItem(item.itemId, true); } catch(e) { /* cleanup */ }
  }
  passed = true;
} catch (e) {
  error = e.message || String(e);
}

const duration = Date.now() - t0;
const status = passed ? 'PASS' : 'FAIL';
const statusBg = passed ? 'var(--success-background)' : 'var(--destructive-background)';
const statusFg = passed ? 'var(--success-foreground)' : 'var(--destructive-foreground)';

render(\`
<div style="font-family:var(--font-sans),system-ui,sans-serif;padding:16px;">
  <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
    <span style="background:\${statusBg};color:\${statusFg};padding:2px 10px;border-radius:var(--rounded-full);font-weight:600;font-size:var(--text-xs);">\${status}</span>
    <strong>publishItem</strong>
    <span style="color:var(--muted-foreground);font-size:var(--text-xs);">\${duration}ms</span>
  </div>
  \${error ? '<div style="color:var(--destructive-foreground);font-size:var(--text-sm);padding:8px;background:var(--destructive-background);border-radius:var(--radius);">' + error + '</div>' : ''}
</div>
\`);
print(status + ' publishItem (' + duration + 'ms)');`,
  },
};
