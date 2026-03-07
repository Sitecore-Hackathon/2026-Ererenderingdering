"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Loader2 } from "lucide-react";
import type { SavedScript, ScriptStorageBackend } from "@/src/lib/script-storage";

interface ScriptLibraryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "save" | "load";
  currentCode?: string;
  onLoad?: (script: SavedScript) => void;
  onSaved?: (script: SavedScript) => void;
  backend: ScriptStorageBackend;
}

export function ScriptLibraryDialog({
  open,
  onOpenChange,
  mode,
  currentCode = "",
  onLoad,
  onSaved,
  backend,
}: ScriptLibraryDialogProps) {
  const [scripts, setScripts] = useState<SavedScript[]>([]);
  const [saveName, setSaveName] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setSaveName("");
      setSelectedId(null);
      setLoading(true);
      backend.listScripts().then((s) => {
        setScripts(s);
        setLoading(false);
      }).catch(() => {
        setScripts([]);
        setLoading(false);
      });
    }
  }, [open, backend]);

  async function handleSave() {
    if (!saveName.trim()) return;
    setLoading(true);
    const script = await backend.saveScript(saveName.trim(), currentCode);
    setLoading(false);
    onSaved?.(script);
    onOpenChange(false);
  }

  function handleLoad() {
    const script = scripts.find((s) => s.id === selectedId);
    if (script) {
      onLoad?.(script);
      onOpenChange(false);
    }
  }

  async function handleDelete(id: string) {
    setLoading(true);
    await backend.deleteScript(id);
    const updated = await backend.listScripts();
    setScripts(updated);
    setLoading(false);
    if (selectedId === id) setSelectedId(null);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === "save" ? "Save Script" : "Script Library"}
          </DialogTitle>
        </DialogHeader>

        {mode === "save" ? (
          <div className="flex flex-col gap-3">
            <Input
              placeholder="Script name..."
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              autoFocus
            />
            <Button onClick={handleSave} disabled={!saveName.trim() || loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
              Save
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="max-h-[300px] overflow-auto border rounded-md">
              {loading ? (
                <div className="p-4 flex items-center justify-center text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Loading scripts...
                </div>
              ) : scripts.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground text-sm">
                  No saved scripts
                </div>
              ) : (
                <div className="divide-y">
                  {scripts.map((script) => (
                    <div
                      key={script.id}
                      className={`flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-accent transition-colors ${
                        selectedId === script.id ? "bg-accent" : ""
                      }`}
                      onClick={() => setSelectedId(script.id)}
                      onDoubleClick={() => {
                        onLoad?.(script);
                        onOpenChange(false);
                      }}
                    >
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-medium truncate">
                          {script.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(script.lastModified).toLocaleString()}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(script.id);
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Button onClick={handleLoad} disabled={!selectedId}>
              Open
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
