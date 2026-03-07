import type { ContentItem } from "../../../../constants";

export const updateTemplateTest: ContentItem = {
  name: "updateTemplate",
  template: "jsScript",
  fields: {
    "__Display name": "Update Template",
    Script: `// Test: Templates > updateTemplate
const t0 = Date.now();
let passed = false;
let error = null;

try {
  const ts = Date.now();
  const folder = await sc.Templates.createTemplateFolder('/sitecore/templates', '__sctest_' + ts + '_utf');
  let templateId = null;
  try {
    if (!folder || !folder.itemId) throw new Error('folder setup failed');
    const tmpl = await sc.Templates.createTemplate(folder.itemId, '__sctest_' + ts + '_ut', {
      sections: [{ name: 'Data', fields: [{ name: 'Text', type: 'Single-Line Text' }] }]
    });
    if (!tmpl || !tmpl.templateId) throw new Error('template setup failed');
    templateId = tmpl.templateId;
    const newName = '__sctest_' + ts + '_ut_updated';
    const result = await sc.Templates.updateTemplate(templateId, { name: newName });
    if (!result) throw new Error('updateTemplate returned null');
  } finally {
    try { if (templateId) await sc.Templates.deleteTemplate(templateId); } catch(e) { /* cleanup */ }
    try { await sc.deleteItem(folder.itemId, true); } catch(e) { /* cleanup */ }
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
    <strong>updateTemplate</strong>
    <span style="color:var(--muted-foreground);font-size:var(--text-xs);">\${duration}ms</span>
  </div>
  \${error ? '<div style="color:var(--destructive-foreground);font-size:var(--text-sm);padding:8px;background:var(--destructive-background);border-radius:var(--radius);">' + error + '</div>' : ''}
</div>
\`);
print(status + ' updateTemplate (' + duration + 'ms)');`,
  },
};
