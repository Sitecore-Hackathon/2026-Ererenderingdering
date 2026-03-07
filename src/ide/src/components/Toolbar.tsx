"use client";

import { Button } from "@/components/ui/button";
import { Play, Save, FolderOpen, Trash2, Loader2, Database, Laptop } from "lucide-react";

interface ToolbarProps {
  onRun: () => void;
  onSave: () => void;
  onLoad: () => void;
  onClear: () => void;
  isRunning: boolean;
  isClientReady: boolean;
  storageMode?: "sitecore" | "local";
}

export function Toolbar({ onRun, onSave, onLoad, onClear, isRunning, isClientReady, storageMode }: ToolbarProps) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 border-b bg-card">
      <Button
        size="sm"
        onClick={onRun}
        disabled={isRunning || !isClientReady}
      >
        {isRunning ? (
          <Loader2 className="h-4 w-4 animate-spin mr-1" />
        ) : (
          <Play className="h-4 w-4 mr-1" />
        )}
        {isRunning ? "Running..." : "Run"}
      </Button>
      <Button size="sm" variant="secondary" onClick={onSave}>
        <Save className="h-4 w-4 mr-1" />
        Save
      </Button>
      <Button size="sm" variant="secondary" onClick={onLoad}>
        <FolderOpen className="h-4 w-4 mr-1" />
        Load
      </Button>
      <Button size="sm" variant="secondary" onClick={onClear}>
        <Trash2 className="h-4 w-4 mr-1" />
        Clear
      </Button>
      <div className="ml-auto flex items-center gap-2">
        {storageMode && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            {storageMode === "sitecore" ? (
              <><Database className="h-3.5 w-3.5" /> Sitecore</>
            ) : (
              <><Laptop className="h-3.5 w-3.5" /> Local</>
            )}
          </span>
        )}
        {!isClientReady && (
          <span className="text-xs text-muted-foreground">
            Connecting to SDK...
          </span>
        )}
      </div>
    </div>
  );
}
