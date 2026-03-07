const STORAGE_KEY = "sitecore-scripting-console-scripts";

export interface SavedScript {
  id: string;
  name: string;
  code: string;
  lastModified: number;
  path?: string;
}

export interface ScriptTreeNode {
  id: string;
  name: string;
  displayName?: string;
  type: "folder" | "script";
  children?: ScriptTreeNode[];
  code?: string;
  path?: string;
}

export interface ScriptStorageBackend {
  listScripts(): Promise<SavedScript[]>;
  listTree(): Promise<ScriptTreeNode[]>;
  saveScript(name: string, code: string, parentId?: string): Promise<SavedScript>;
  loadScript(id: string): Promise<SavedScript | undefined>;
  updateScript(id: string, updates: Partial<Pick<SavedScript, "name" | "code">>): Promise<SavedScript | undefined>;
  deleteScript(id: string): Promise<boolean>;
}

const DEFAULT_SCRIPTS: SavedScript[] = [
  {
    id: "example-get-context",
    name: "Get Context",
    code: `// Get the current application context
const ctx = await Sitecore.getContext();
print(JSON.stringify(ctx, null, 2));`,
    lastModified: Date.now(),
  },
  {
    id: "example-list-sites",
    name: "List Sites",
    code: `// List all sites in XM Cloud
const sites = await Sitecore.listSites();
print(JSON.stringify(sites, null, 2));`,
    lastModified: Date.now(),
  },
  {
    id: "example-graphql-query",
    name: "GraphQL Query",
    code: `// Query content tree via GraphQL
const result = await Sitecore.graphql(\`
  query {
    item(where: { database: "master", path: "/sitecore/content" }) {
      itemId
      name
      path
      children {
        nodes {
          itemId
          name
          path
        }
      }
    }
  }
\`);
print(JSON.stringify(result, null, 2));`,
    lastModified: Date.now(),
  },
  {
    id: "example-render-html",
    name: "Render HTML",
    code: `// Render custom HTML in the Results tab
const ctx = await Sitecore.getContext();
render(\`
  <div style="font-family: sans-serif; padding: 1rem;">
    <h2>Application Context</h2>
    <p><strong>App Name:</strong> \${ctx.appName || 'N/A'}</p>
    <p><strong>Tenant ID:</strong> \${ctx.tenantId || 'N/A'}</p>
  </div>
\`);`,
    lastModified: Date.now(),
  },
  {
    id: "example-get-item",
    name: "Get Item",
    code: `// Get a content item by path
const item = await Sitecore.getItem("/sitecore/content");
print(JSON.stringify(item, null, 2));`,
    lastModified: Date.now(),
  },
];

// The API Test Suite has been moved to the Tests folder (installed via Sitecore items).

function getScriptsFromStorage(): SavedScript[] {
  if (typeof window === "undefined") return DEFAULT_SCRIPTS;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SCRIPTS));
    return DEFAULT_SCRIPTS;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return DEFAULT_SCRIPTS;
  }
}

function saveScriptsToStorage(scripts: SavedScript[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scripts));
}

export function createLocalScriptStorage(): ScriptStorageBackend {
  return {
    async listScripts() {
      return getScriptsFromStorage().sort((a, b) => b.lastModified - a.lastModified);
    },

    async listTree() {
      const scripts = getScriptsFromStorage().sort((a, b) => a.name.localeCompare(b.name));
      return [{
        id: "local-scripts",
        name: "Local Scripts",
        type: "folder" as const,
        children: scripts.map((s) => ({
          id: s.id,
          name: s.name,
          type: "script" as const,
          code: s.code,
        })),
      }];
    },

    async saveScript(name: string, code: string) {
      const scripts = getScriptsFromStorage();
      const script: SavedScript = {
        id: `script-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name,
        code,
        lastModified: Date.now(),
      };
      scripts.push(script);
      saveScriptsToStorage(scripts);
      return script;
    },

    async loadScript(id: string) {
      return getScriptsFromStorage().find((s) => s.id === id);
    },

    async updateScript(id: string, updates: Partial<Pick<SavedScript, "name" | "code">>) {
      const scripts = getScriptsFromStorage();
      const index = scripts.findIndex((s) => s.id === id);
      if (index === -1) return undefined;
      if (updates.name !== undefined) scripts[index].name = updates.name;
      if (updates.code !== undefined) scripts[index].code = updates.code;
      scripts[index].lastModified = Date.now();
      saveScriptsToStorage(scripts);
      return scripts[index];
    },

    async deleteScript(id: string) {
      const scripts = getScriptsFromStorage();
      const filtered = scripts.filter((s) => s.id !== id);
      if (filtered.length === scripts.length) return false;
      saveScriptsToStorage(filtered);
      return true;
    },
  };
}

// Legacy sync exports for backward compat (used nowhere now but kept just in case)
export function listScripts(): SavedScript[] {
  return getScriptsFromStorage().sort((a, b) => b.lastModified - a.lastModified);
}

export function saveScript(name: string, code: string): SavedScript {
  const scripts = getScriptsFromStorage();
  const script: SavedScript = {
    id: `script-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name,
    code,
    lastModified: Date.now(),
  };
  scripts.push(script);
  saveScriptsToStorage(scripts);
  return script;
}

export function loadScript(id: string): SavedScript | undefined {
  return getScriptsFromStorage().find((s) => s.id === id);
}

export function updateScript(id: string, updates: Partial<Pick<SavedScript, "name" | "code">>): SavedScript | undefined {
  const scripts = getScriptsFromStorage();
  const index = scripts.findIndex((s) => s.id === id);
  if (index === -1) return undefined;
  if (updates.name !== undefined) scripts[index].name = updates.name;
  if (updates.code !== undefined) scripts[index].code = updates.code;
  scripts[index].lastModified = Date.now();
  saveScriptsToStorage(scripts);
  return scripts[index];
}

export function deleteScript(id: string): boolean {
  const scripts = getScriptsFromStorage();
  const filtered = scripts.filter((s) => s.id !== id);
  if (filtered.length === scripts.length) return false;
  saveScriptsToStorage(filtered);
  return true;
}

