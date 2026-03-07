"use client";

import { Button } from "@/components/ui/button";
import { Play, Save, SaveAll, FolderOpen, Trash2, Loader2, BookOpen } from "lucide-react";

interface ToolbarProps {
  onRun: () => void;
  onSave: () => void;
  onSaveAs: () => void;
  onLoad: () => void;
  onClear: () => void;
  onToggleHelp: () => void;
  isRunning: boolean;
  isClientReady: boolean;
  canSave: boolean;
  helpOpen: boolean;
}

export function Toolbar({ onRun, onSave, onSaveAs, onLoad, onClear, onToggleHelp, isRunning, isClientReady, canSave, helpOpen }: ToolbarProps) {
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
      <Button size="sm" variant="outline" onClick={onSave} disabled={!canSave} title={canSave ? "Save to existing script" : "No linked script — use Save As"}>
        <Save className="h-4 w-4 mr-1" />
        Save
      </Button>
      <Button size="sm" variant="outline" onClick={onSaveAs}>
        <SaveAll className="h-4 w-4 mr-1" />
        Save As
      </Button>
      <Button size="sm" variant="outline" onClick={onLoad}>
        <FolderOpen className="h-4 w-4 mr-1" />
        Load
      </Button>
      <Button size="sm" variant="outline" onClick={onClear}>
        <Trash2 className="h-4 w-4 mr-1" />
        Clear
      </Button>
      <Button size="sm" variant={helpOpen ? "default" : "outline"} onClick={onToggleHelp}>
        <BookOpen className="h-4 w-4 mr-1" />
        Help
      </Button>
      <div className="ml-auto flex items-center gap-2">
        {!isClientReady && (
          <span className="text-xs text-muted-foreground">
            Connecting to SDK...
          </span>
        )}
      </div>
    </div>
  );
}
