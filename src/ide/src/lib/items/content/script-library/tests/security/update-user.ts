import type { ContentItem } from "../../../../constants";

export const updateUserTest: ContentItem = {
  name: "updateUser",
  template: "jsScript",
  fields: {
    "__Display name": "Update User",
    Script: `// Test: Security > updateUser
const t0 = Date.now();
let passed = false;
let error = null;

try {
  const ts = Date.now();
  const domainName = 'sctest' + ts;
  await sc.Security.createDomain(domainName);
  const userName = domainName + '\\\\testuser' + ts;
  try {
    await sc.Security.createUser({ userName: userName, password: 'T3st!Pass' + ts, email: 'test@example.com' });
    const result = await sc.Security.updateUser({ userName: userName, fullName: 'Updated Name' });
    if (!result) throw new Error('update user result is null');
  } finally {
    try { await sc.Security.deleteUser(userName); } catch(e) { /* cleanup */ }
    try { await sc.Security.deleteDomain(domainName); } catch(e) { /* cleanup */ }
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
    <strong>updateUser</strong>
    <span style="color:var(--muted-foreground);font-size:var(--text-xs);">\${duration}ms</span>
  </div>
  \${error ? '<div style="color:var(--destructive-foreground);font-size:var(--text-sm);padding:8px;background:var(--destructive-background);border-radius:var(--radius);">' + error + '</div>' : ''}
</div>
\`);
print(status + ' updateUser (' + duration + 'ms)');`,
  },
};
