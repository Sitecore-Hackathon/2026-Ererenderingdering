import type { ContentItem } from "../../../../constants";

export const getPublishingQueueTest: ContentItem = {
  name: "getPublishingQueue",
  template: "jsScript",
  fields: {
    "__Display name": "Get Publishing Queue",
    Script: `// Test: Publishing > getPublishingQueue
const t0 = Date.now();
let passed = false;
let error = null;

try {
  const queue = await sc.Publishing.getPublishingQueue({ sort: { field: 'date', direction: 'DESCENDING' }, paging: { pageIndex: 0, pageSize: 10 } });
  if (!queue) throw new Error('publishing queue is null');
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
    <strong>getPublishingQueue</strong>
    <span style="color:var(--muted-foreground);font-size:var(--text-xs);">\${duration}ms</span>
  </div>
  \${error ? '<div style="color:var(--destructive-foreground);font-size:var(--text-sm);padding:8px;background:var(--destructive-background);border-radius:var(--radius);">' + error + '</div>' : ''}
</div>
\`);
print(status + ' getPublishingQueue (' + duration + 'ms)');`,
  },
};
