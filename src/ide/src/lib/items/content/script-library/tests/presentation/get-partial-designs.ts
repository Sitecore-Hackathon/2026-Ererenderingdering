import type { ContentItem } from "../../../../constants";

export const getPartialDesignsTest: ContentItem = {
  name: "getPartialDesigns",
  template: "jsScript",
  fields: {
    "__Display name": "Get Partial Designs",
    Script: `// Test: Presentation > getPartialDesigns
const t0 = Date.now();
let passed = false;
let error = null;

try {
  const sites = await sc.Sites.getSites();
  if (!sites || sites.length === 0) throw new Error('No sites available');
  const siteName = sites[0].name || sites[0].siteName;
  const designs = await sc.Presentation.getPartialDesigns(siteName);
  if (!designs) throw new Error('partial designs is null');
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
    <strong>getPartialDesigns</strong>
    <span style="color:var(--muted-foreground);font-size:var(--text-xs);">\${duration}ms</span>
  </div>
  \${error ? '<div style="color:var(--destructive-foreground);font-size:var(--text-sm);padding:8px;background:var(--destructive-background);border-radius:var(--radius);">' + error + '</div>' : ''}
</div>
\`);
print(status + ' getPartialDesigns (' + duration + 'ms)');`,
  },
};
