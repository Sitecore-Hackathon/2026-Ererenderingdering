const sitecoreMethods: {
  label: string;
  detail: string;
  documentation: string;
  insertText: string;
}[] = [
  {
    label: "Sitecore.getContext",
    detail: "() => Promise<ApplicationContext>",
    documentation: "Get the current application context including tenant, organization, and resource access info.",
    insertText: "Sitecore.getContext()",
  },
  {
    label: "Sitecore.graphql",
    detail: "(query: string, variables?: object) => Promise<any>",
    documentation: "Execute an authoring GraphQL query or mutation against XM Cloud.",
    insertText: 'Sitecore.graphql(`\n  query {\n    item(where: { database: "master", path: "/sitecore/content" }) {\n      itemId\n      name\n      path\n    }\n  }\n`)',
  },
  {
    label: "Sitecore.listSites",
    detail: "() => Promise<any>",
    documentation: "List all sites configured in XM Cloud.",
    insertText: "Sitecore.listSites()",
  },
  {
    label: "Sitecore.retrievePage",
    detail: '(pageId: string, site: string, language?: string) => Promise<any>',
    documentation: "Retrieve a page by ID, site name, and optional language.",
    insertText: 'Sitecore.retrievePage("${1:pageId}", "${2:siteName}", "${3:en}")',
  },
  {
    label: "Sitecore.reloadCanvas",
    detail: "() => Promise<void>",
    documentation: "Reload the Pages editor canvas.",
    insertText: "Sitecore.reloadCanvas()",
  },
  {
    label: "Sitecore.navigateTo",
    detail: "(itemId: string) => Promise<void>",
    documentation: "Navigate the Pages editor to a specific item by ID.",
    insertText: 'Sitecore.navigateTo("${1:itemId}")',
  },
  {
    label: "Sitecore.getItem",
    detail: "(path: string) => Promise<any>",
    documentation: "Get a content item by its Sitecore path, including fields and children.",
    insertText: 'Sitecore.getItem("${1:/sitecore/content}")',
  },
  {
    label: "Sitecore.updateItem",
    detail: "(id: string, path: string, fields: Record<string, string>) => Promise<any>",
    documentation: "Update fields on a content item by ID.",
    insertText: 'Sitecore.updateItem("${1:itemId}", "${2:/sitecore/content}", { "${3:Title}": "${4:New Value}" })',
  },
];

const utilityFunctions: {
  label: string;
  detail: string;
  documentation: string;
  insertText: string;
}[] = [
  {
    label: "print",
    detail: "(...args: any[]) => void",
    documentation: "Print values to the Console output panel. Accepts multiple arguments.",
    insertText: "print(${1})",
  },
  {
    label: "render",
    detail: "(html: string) => void",
    documentation: "Render HTML content in the Results tab.",
    insertText: "render(`${1:<h1>Hello</h1>}`)",
  },
];

export function registerCompletions(monaco: any) {
  monaco.languages.registerCompletionItemProvider("javascript", {
    triggerCharacters: ["."],
    provideCompletionItems(model: any, position: any) {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      const lineContent = model.getLineContent(position.lineNumber);
      const textBefore = lineContent.substring(0, position.column - 1);

      const suggestions: any[] = [];

      // Sitecore.* completions
      if (textBefore.endsWith("Sitecore.")) {
        for (const method of sitecoreMethods) {
          const methodName = method.label.replace("Sitecore.", "");
          suggestions.push({
            label: methodName,
            kind: monaco.languages.CompletionItemKind.Method,
            detail: method.detail,
            documentation: method.documentation,
            insertText: method.insertText.replace("Sitecore.", ""),
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range,
          });
        }
      } else {
        // Top-level completions
        for (const method of sitecoreMethods) {
          suggestions.push({
            label: method.label,
            kind: monaco.languages.CompletionItemKind.Method,
            detail: method.detail,
            documentation: method.documentation,
            insertText: method.insertText,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range,
          });
        }
        for (const fn of utilityFunctions) {
          suggestions.push({
            label: fn.label,
            kind: monaco.languages.CompletionItemKind.Function,
            detail: fn.detail,
            documentation: fn.documentation,
            insertText: fn.insertText,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range,
          });
        }
      }

      return { suggestions };
    },
  });
}
