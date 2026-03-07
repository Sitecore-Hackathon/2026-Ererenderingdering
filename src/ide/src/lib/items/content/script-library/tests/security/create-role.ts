import type { ContentItem } from "../../../../constants";

export const createRoleTest: ContentItem = {
  name: "createRole",
  template: "jsScript",
  fields: {
    "__Display name": "Create Role",
    Script: `// Test: Security > createRole
const t0 = Date.now();
let passed = false;
let error = null;

try {
  const roleName = 'sitecore\\\\SCTestRole' + Date.now();
  const created = await sc.Security.createRole(roleName);
  try {
    if (!created) throw new Error('created role is null');
    const fetched = await sc.Security.getRole(roleName);
    if (!fetched) throw new Error('fetched role is null');
    if (!fetched.name.includes('SCTestRole')) throw new Error('role name mismatch');
  } finally {
    try { await sc.Security.deleteRole(roleName); } catch(e) { /* cleanup */ }
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
    <strong>createRole</strong>
    <span style="color:var(--muted-foreground);font-size:var(--text-xs);">\${duration}ms</span>
  </div>
  \${error ? '<div style="color:var(--destructive-foreground);font-size:var(--text-sm);padding:8px;background:var(--destructive-background);border-radius:var(--radius);">' + error + '</div>' : ''}
</div>
\`);
print(status + ' createRole (' + duration + 'ms)');`,
  },
};
