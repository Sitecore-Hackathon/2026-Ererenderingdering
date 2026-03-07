import type { ContentItem } from "../../../../constants";

export const graphqlTest: ContentItem = {
  name: "graphql",
  template: "jsScript",
  fields: {
    "__Display name": "GraphQL",
    Script: `// Test: Core > graphql
const t0 = Date.now();
let passed = false;
let error = null;

try {
  const result = await sc.graphql(\`
    query {
      item(where: { database: "master", path: "/sitecore/content" }) {
        itemId
        name
      }
    }
  \`);
  if (!result) throw new Error('graphql result is null');
  if (result.item.name !== 'content') throw new Error('Expected item name "content", got "' + result.item.name + '"');
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
    <strong>graphql</strong>
    <span style="color:var(--muted-foreground);font-size:var(--text-xs);">\${duration}ms</span>
  </div>
  \${error ? '<div style="color:var(--destructive-foreground);font-size:var(--text-sm);padding:8px;background:var(--destructive-background);border-radius:var(--radius);">' + error + '</div>' : ''}
</div>
\`);
print(status + ' graphql (' + duration + 'ms)');`,
  },
};
