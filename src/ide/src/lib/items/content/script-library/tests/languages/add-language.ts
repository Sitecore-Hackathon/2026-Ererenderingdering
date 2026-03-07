import type { ContentItem } from "../../../../constants";

export const addLanguageTest: ContentItem = {
  name: "addLanguage",
  template: "jsScript",
  fields: {
    "__Display name": "Add Language",
    Script: `// Test: Languages > addLanguage
const t0 = Date.now();
let passed = false;
let error = null;

try {
  const result = await sc.Languages.addLanguage({ languageCode: 'zu', regionCode: 'ZA' });
  try {
    if (!result) throw new Error('add language result is null');
    const langs = await sc.Languages.getLanguages();
    const hasZulu = Array.isArray(langs) && langs.some(l => (l.name || l.isoCode || l) === 'zu-ZA' || (l.name || '').includes('zu'));
    if (!hasZulu) throw new Error('zu-ZA should be in languages');
  } finally {
    try { await sc.Languages.deleteLanguage('zu-ZA'); } catch(e) { /* cleanup */ }
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
    <strong>addLanguage</strong>
    <span style="color:var(--muted-foreground);font-size:var(--text-xs);">\${duration}ms</span>
  </div>
  \${error ? '<div style="color:var(--destructive-foreground);font-size:var(--text-sm);padding:8px;background:var(--destructive-background);border-radius:var(--radius);">' + error + '</div>' : ''}
</div>
\`);
print(status + ' addLanguage (' + duration + 'ms)');`,
  },
};
