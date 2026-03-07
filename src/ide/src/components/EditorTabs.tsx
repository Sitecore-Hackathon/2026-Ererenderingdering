"use client";

import { useEditorStore } from "@/src/stores/editor-store";
import { X, Plus } from "lucide-react";

export function EditorTabs() {
  const { tabs, activeTabId, setActiveTab, openTab, closeTab } =
    useEditorStore();

  return (
    <div className="flex items-center border-b bg-muted/30 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`group flex items-center gap-1 px-3 py-1.5 text-xs shrink-0 border-b-2 transition-colors ${
            tab.id === activeTabId
              ? "border-primary text-foreground bg-background"
              : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
          onClick={() => setActiveTab(tab.id)}
        >
          <span className="truncate max-w-[120px]">{tab.name}</span>
          <span
            role="button"
            className="ml-1 p-0.5 rounded hover:bg-destructive/20 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              closeTab(tab.id);
            }}
          >
            <X className="h-3 w-3" />
          </span>
        </button>
      ))}
      <button
        className="flex items-center justify-center p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/50 shrink-0 transition-colors"
        onClick={() => openTab({ name: "Untitled", code: "" })}
        title="New tab"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
