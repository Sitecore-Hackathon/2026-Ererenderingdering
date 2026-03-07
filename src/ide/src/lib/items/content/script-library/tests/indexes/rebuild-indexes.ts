import type { ContentItem } from "../../../../constants";

export const rebuildIndexesTest: ContentItem = {
  name: "rebuildIndexes",
  template: "jsScript",
  fields: {
    "__Display name": "Rebuild Indexes",
    Script: `// Test: Indexes > rebuildIndexes
const t0 = Date.now();
let passed = false;
let error = null;

try {
  const indexes = await sc.Indexes.getIndexes();
  if (!Array.isArray(indexes) || indexes.length === 0) throw new Error('No indexes available');
  const indexName = indexes[0].name || indexes[0].indexName || indexes[0];
  if (typeof indexName === 'object') throw new Error('Cannot determine index name');
  try {
    const result = await sc.Indexes.rebuildIndexes([indexName]);
    if (!result) throw new Error('rebuildIndexes returned null');
  } catch (e) {
    throw new Error('Skipped: may need admin permissions - ' + (e.message || e));
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
    <strong>rebuildIndexes</strong>
    <span style="color:var(--muted-foreground);font-size:var(--text-xs);">\${duration}ms</span>
  </div>
  \${error ? '<div style="color:var(--destructive-foreground);font-size:var(--text-sm);padding:8px;background:var(--destructive-background);border-radius:var(--radius);">' + error + '</div>' : ''}
</div>
\`);
print(status + ' rebuildIndexes (' + duration + 'ms)');`,
  },
};
