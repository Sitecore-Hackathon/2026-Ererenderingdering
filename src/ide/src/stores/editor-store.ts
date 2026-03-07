import { create } from "zustand";
import { persist } from "zustand/middleware";

const DEFAULT_CODE = `// Sitecore JS Scripting Console
// Use Sitecore.* (or sc.* shorthand), print(), and render()
// Press Ctrl+Enter to run

const ctx = await sc.getContext();
print("Application context loaded:");
print(JSON.stringify(ctx, null, 2));
`;

export interface EditorTab {
  id: string;
  scriptId?: string;
  name: string;
  code: string;
}

interface EditorState {
  tabs: EditorTab[];
  activeTabId: string;
  setActiveTab: (tabId: string) => void;
  updateTabCode: (tabId: string, code: string) => void;
  openTab: (tab: { scriptId?: string; name: string; code: string }) => string;
  closeTab: (tabId: string) => void;
  linkTabToScript: (tabId: string, scriptId: string, name: string) => void;
}

function createTab(name: string, code: string, scriptId?: string): EditorTab {
  return { id: crypto.randomUUID(), scriptId, name, code };
}

function createDefaultTab(): EditorTab {
  return createTab("Untitled", DEFAULT_CODE);
}

export const useEditorStore = create<EditorState>()(
  persist(
    (set, get) => ({
      tabs: [createDefaultTab()],
      activeTabId: "",

      setActiveTab: (tabId) => set({ activeTabId: tabId }),

      updateTabCode: (tabId, code) =>
        set((state) => ({
          tabs: state.tabs.map((t) =>
            t.id === tabId ? { ...t, code } : t
          ),
        })),

      openTab: (tab) => {
        const state = get();
        // Deduplicate by scriptId
        if (tab.scriptId) {
          const existing = state.tabs.find((t) => t.scriptId === tab.scriptId);
          if (existing) {
            set({ activeTabId: existing.id });
            return existing.id;
          }
        }
        const newTab = createTab(tab.name, tab.code, tab.scriptId);
        set({ tabs: [...state.tabs, newTab], activeTabId: newTab.id });
        return newTab.id;
      },

      closeTab: (tabId) =>
        set((state) => {
          const idx = state.tabs.findIndex((t) => t.id === tabId);
          if (idx === -1) return state;
          const remaining = state.tabs.filter((t) => t.id !== tabId);
          if (remaining.length === 0) {
            const fresh = createDefaultTab();
            return { tabs: [fresh], activeTabId: fresh.id };
          }
          const needNewActive = state.activeTabId === tabId;
          return {
            tabs: remaining,
            activeTabId: needNewActive
              ? remaining[Math.min(idx, remaining.length - 1)].id
              : state.activeTabId,
          };
        }),

      linkTabToScript: (tabId, scriptId, name) =>
        set((state) => ({
          tabs: state.tabs.map((t) =>
            t.id === tabId ? { ...t, scriptId, name } : t
          ),
        })),
    }),
    {
      name: "ide-editor-store",
      version: 1,
      migrate: (persisted: unknown, version: number) => {
        if (version === 0) {
          const old = persisted as { code?: string };
          const tab = createTab("Untitled", old?.code ?? DEFAULT_CODE);
          return { tabs: [tab], activeTabId: tab.id };
        }
        return persisted as EditorState;
      },
    }
  )
);
