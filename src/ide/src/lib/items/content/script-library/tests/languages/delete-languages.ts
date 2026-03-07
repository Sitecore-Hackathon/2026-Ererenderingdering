import type { ContentItem } from "../../../../constants";

export const deleteLanguagesTest: ContentItem = {
  name: "deleteLanguages",
  template: "jsScript",
  fields: {
    "__Display name": "Delete Languages",
    Script: `// Test: Languages > deleteLanguages
const t0 = Date.now();
let passed = false;
let error = null;

try {
  await sc.Languages.addLanguage({ languageCode: 'af', regionCode: 'ZA' });
  await sc.Languages.addLanguage({ languageCode: 'sq', regionCode: 'AL' });
  try {
    const result = await sc.Languages.deleteLanguages(['af-ZA', 'sq-AL']);
    if (!result) throw new Error('delete languages result is null');
  } catch(e) {
    // cleanup individually if batch delete fails
    try { await sc.Languages.deleteLanguage('af-ZA'); } catch(e2) { /* ignore */ }
    try { await sc.Languages.deleteLanguage('sq-AL'); } catch(e2) { /* ignore */ }
    throw e;
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
    <strong>deleteLanguages</strong>
    <span style="color:var(--muted-foreground);font-size:var(--text-xs);">\${duration}ms</span>
  </div>
  \${error ? '<div style="color:var(--destructive-foreground);font-size:var(--text-sm);padding:8px;background:var(--destructive-background);border-radius:var(--radius);">' + error + '</div>' : ''}
</div>
\`);
print(status + ' deleteLanguages (' + duration + 'ms)');`,
  },
};
