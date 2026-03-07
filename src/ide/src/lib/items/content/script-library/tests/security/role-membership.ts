import type { ContentItem } from "../../../../constants";

export const roleMembershipTest: ContentItem = {
  name: "roleMembership",
  template: "jsScript",
  fields: {
    "__Display name": "Role Membership",
    Script: `// Test: Security > roleMembership
const t0 = Date.now();
let passed = false;
let error = null;

try {
  const ts = Date.now();
  const roleAName = 'sitecore\\\\SCTestRoleA' + ts;
  const roleBName = 'sitecore\\\\SCTestRoleB' + ts;
  const domainName = 'sctest' + ts;
  const userName = domainName + '\\\\testuser' + ts;
  await sc.Security.createRole(roleAName);
  await sc.Security.createRole(roleBName);
  await sc.Security.createDomain(domainName);
  await sc.Security.createUser({ userName: userName, password: 'T3st!Pass' + ts, email: 'test@example.com' });
  try {
    const addRoleResult = await sc.Security.addRoleToRoles(roleAName, [roleBName]);
    if (!addRoleResult) throw new Error('addRoleToRoles result is null');
    const removeRoleResult = await sc.Security.deleteRoleFromRoles(roleAName, [roleBName]);
    if (!removeRoleResult) throw new Error('deleteRoleFromRoles result is null');
    const addAccountResult = await sc.Security.addAccountsToRole(roleAName, { users: [userName] });
    if (!addAccountResult) throw new Error('addAccountsToRole result is null');
    const removeAccountResult = await sc.Security.deleteAccountsFromRole(roleAName, { users: [userName] });
    if (!removeAccountResult) throw new Error('deleteAccountsFromRole result is null');
  } finally {
    try { await sc.Security.deleteUser(userName); } catch(e) { /* cleanup */ }
    try { await sc.Security.deleteDomain(domainName); } catch(e) { /* cleanup */ }
    try { await sc.Security.deleteRole(roleAName); } catch(e) { /* cleanup */ }
    try { await sc.Security.deleteRole(roleBName); } catch(e) { /* cleanup */ }
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
    <strong>roleMembership</strong>
    <span style="color:var(--muted-foreground);font-size:var(--text-xs);">\${duration}ms</span>
  </div>
  \${error ? '<div style="color:var(--destructive-foreground);font-size:var(--text-sm);padding:8px;background:var(--destructive-background);border-radius:var(--radius);">' + error + '</div>' : ''}
</div>
\`);
print(status + ' roleMembership (' + duration + 'ms)');`,
  },
};
