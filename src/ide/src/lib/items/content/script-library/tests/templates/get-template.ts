import type { ContentItem } from "../../../../constants";

export const getTemplateTest: ContentItem = {
  name: "getTemplate",
  template: "jsScript",
  fields: {
    "__Display name": "Get Template",
    Script: `// Test: Templates > getTemplate
const t0 = Date.now();
let passed = false;
let error = null;

try {
  const ts = Date.now();
  const folder = await sc.Templates.createTemplateFolder('/sitecore/templates', '__sctest_' + ts + '_gtf');
  let templateId = null;
  try {
    if (!folder || !folder.itemId) throw new Error('folder setup failed');
    const tmpl = await sc.Templates.createTemplate(folder.itemId, '__sctest_' + ts + '_gt', {
      sections: [{ name: 'Data', fields: [{ name: 'Title', type: 'Single-Line Text' }] }]
    });
    if (!tmpl || !tmpl.templateId) throw new Error('template setup failed');
    templateId = tmpl.templateId;
    const fetched = await sc.Templates.getTemplate(templateId);
    if (!fetched) throw new Error('getTemplate returned null');
    if (fetched.templateId.replace(/[{}]/g, '').toLowerCase() !== templateId.replace(/[{}]/g, '').toLowerCase()) throw new Error('templateId mismatch');
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
    <strong>getTemplate</strong>
    <span style="color:var(--muted-foreground);font-size:var(--text-xs);">\${duration}ms</span>
  </div>
  \${error ? '<div style="color:var(--destructive-foreground);font-size:var(--text-sm);padding:8px;background:var(--destructive-background);border-radius:var(--radius);">' + error + '</div>' : ''}
</div>
\`);
print(status + ' getTemplate (' + duration + 'ms)');`,
  },
};
