"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Loader2, ChevronRight, Folder, FolderOpen, FileCode2, Check } from "lucide-react";
import type { SavedScript, ScriptStorageBackend, ScriptTreeNode } from "@/src/lib/script-storage";

interface ScriptLibraryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "save" | "load";
  currentCode?: string;
  onLoad?: (script: SavedScript) => void;
  onSaved?: (script: SavedScript) => void;
  backend: ScriptStorageBackend;
}

function TreeNode({
  node,
  depth,
  selectedId,
  highlightedScriptId,
  onSelect,
  onDoubleClick,
  onDelete,
  onSelectScript,
  expandedIds,
  toggleExpanded,
  mode = "load",
  isDisabled = false,
}: {
  node: ScriptTreeNode;
  depth: number;
  selectedId: string | null;
  highlightedScriptId?: string | null;
  onSelect: (node: ScriptTreeNode) => void;
  onDoubleClick: (node: ScriptTreeNode) => void;
  onDelete: (id: string) => void;
  onSelectScript?: (node: ScriptTreeNode) => void;
  expandedIds: Set<string>;
  toggleExpanded: (id: string) => void;
  mode?: "save" | "load";
  isDisabled?: boolean;
}) {
  const isFolder = node.type === "folder";
  const isExpanded = expandedIds.has(node.id);
  const isSelected = isFolder
    ? selectedId === node.id
    : mode === "save"
      ? highlightedScriptId === node.id
      : selectedId === node.id;

  return (
    <>
      <div
        className={`flex items-center gap-1 px-2 py-1 transition-colors select-none ${
          isDisabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:bg-accent"
        } ${isSelected ? "bg-accent" : ""}`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => {
          if (isDisabled) {
            if (isFolder) toggleExpanded(node.id);
            return;
          }
          if (mode === "save" && isFolder) {
            onSelect(node);
            toggleExpanded(node.id);
          } else if (mode === "save" && !isFolder) {
            onSelectScript?.(node);
          } else if (isFolder) {
            toggleExpanded(node.id);
          } else {
            onSelect(node);
          }
        }}
        onDoubleClick={() => {
          if (isDisabled) return;
          if (!isFolder) onDoubleClick(node);
        }}
      >
        {isFolder ? (
          <ChevronRight
            className={`h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform ${
              isExpanded ? "rotate-90" : ""
            }`}
          />
        ) : (
          <span className="w-3.5 shrink-0" />
        )}
        {isFolder ? (
          isExpanded ? (
            <FolderOpen className="h-4 w-4 shrink-0 text-yellow-600" />
          ) : (
            <Folder className="h-4 w-4 shrink-0 text-yellow-600" />
          )
        ) : (
          <FileCode2 className="h-4 w-4 shrink-0 text-blue-500" />
        )}
        <span className="text-sm truncate flex-1">{node.displayName || node.name}</span>
        {mode === "save" && isSelected && (
          <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
        )}
        {mode === "load" && !isFolder && (
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 shrink-0 opacity-0 group-hover:opacity-100 hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(node.id);
            }}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        )}
      </div>
      {isFolder && isExpanded && node.children?.map((child) => (
        <TreeNode
          key={child.id}
          node={child}
          depth={depth + 1}
          selectedId={selectedId}
          highlightedScriptId={highlightedScriptId}
          onSelect={onSelect}
          onDoubleClick={onDoubleClick}
          onDelete={onDelete}
          onSelectScript={onSelectScript}
          expandedIds={expandedIds}
          toggleExpanded={toggleExpanded}
          mode={mode}
          isDisabled={isDisabled && child.name !== "User Scripts"}
        />
      ))}
    </>
  );
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
  const [tree, setTree] = useState<ScriptTreeNode[]>([]);
  const [saveName, setSaveName] = useState("");
  const [selectedNode, setSelectedNode] = useState<ScriptTreeNode | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedFolderName, setSelectedFolderName] = useState<string>("User Scripts");
  const [overwriteTarget, setOverwriteTarget] = useState<ScriptTreeNode | null>(null);
  const [confirmOverwrite, setConfirmOverwrite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const loadTree = useCallback(async () => {
    setLoading(true);
    try {
      const t = await backend.listTree();
      setTree(t);
      // Auto-expand top-level folders
      setExpandedIds(new Set(t.map((n) => n.id)));
      // Auto-select User Scripts folder for save mode
      // Prefer the real "User Scripts" child under Script Library over the synthetic top-level node
      const scriptLib = t.find((n) => n.id === "script-library");
      const realUserScripts = scriptLib?.children?.find((c) => c.name === "User Scripts");
      const fallback = t.find((n) => n.id === "user-scripts") ?? t[0];
      const defaultFolder = realUserScripts ?? fallback;
      if (defaultFolder) {
        setSelectedFolderId(defaultFolder.id);
        setSelectedFolderName(defaultFolder.name);
      }
    } catch {
      setTree([]);
    }
    setLoading(false);
  }, [backend]);

  useEffect(() => {
    if (open) {
      setSaveName("");
      setSelectedNode(null);
      setOverwriteTarget(null);
      setConfirmOverwrite(false);
      loadTree();
    }
  }, [open, loadTree]);

  const toggleExpanded = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  async function handleSave() {
    if (!saveName.trim()) return;

    // If there's an overwrite target and we haven't confirmed yet, ask
    if (overwriteTarget && !confirmOverwrite) {
      setConfirmOverwrite(true);
      return;
    }

    setLoading(true);
    let script: SavedScript;
    if (overwriteTarget && confirmOverwrite) {
      // Overwrite existing script
      const updated = await backend.updateScript(overwriteTarget.id, { code: currentCode });
      script = updated ?? { id: overwriteTarget.id, name: overwriteTarget.name, code: currentCode, lastModified: Date.now() };
      script.path = overwriteTarget.path;
    } else {
      script = await backend.saveScript(saveName.trim(), currentCode, selectedFolderId ?? undefined);
    }
    setLoading(false);
    onSaved?.(script);
    onOpenChange(false);
  }

  function handleSelectScriptForOverwrite(node: ScriptTreeNode) {
    setSaveName(node.name);
    setOverwriteTarget(node);
    setConfirmOverwrite(false);
    // Find and select the parent folder
    function findParent(nodes: ScriptTreeNode[], targetId: string): ScriptTreeNode | null {
      for (const n of nodes) {
        if (n.children?.some((c) => c.id === targetId)) return n;
        if (n.children) {
          const found = findParent(n.children, targetId);
          if (found) return found;
        }
      }
      return null;
    }
    const parent = findParent(tree, node.id);
    if (parent) {
      setSelectedFolderId(parent.id);
      setSelectedFolderName(parent.name);
    }
  }

  function handleLoad() {
    if (!selectedNode || selectedNode.type !== "script") return;
    onLoad?.({
      id: selectedNode.id,
      name: selectedNode.displayName || selectedNode.name,
      code: selectedNode.code ?? "",
      lastModified: Date.now(),
      path: selectedNode.path,
    });
    onOpenChange(false);
  }

  async function handleDelete(id: string) {
    setLoading(true);
    await backend.deleteScript(id);
    await loadTree();
    setLoading(false);
    if (selectedNode?.id === id) setSelectedNode(null);
  }

  function handleDoubleClick(node: ScriptTreeNode) {
    if (node.type !== "script") return;
    onLoad?.({
      id: node.id,
      name: node.displayName || node.name,
      code: node.code ?? "",
      lastModified: Date.now(),
      path: node.path,
    });
    onOpenChange(false);
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
            {/* Show folder tree if there are meaningful folders */}
            {(tree.length > 1 || tree.some((n) => n.children?.some((c) => c.type === "folder"))) && (
              <>
                <label className="text-sm font-medium">Save to:</label>
                <div className="max-h-[200px] overflow-auto border rounded-md">
                  {loading ? (
                    <div className="p-4 flex items-center justify-center text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Loading...
                    </div>
                  ) : (
                    <div className="py-1">
                      {tree.filter((node) => node.id !== "user-scripts").map((node) => (
                        <TreeNode
                          key={node.id}
                          node={node}
                          depth={0}
                          selectedId={selectedFolderId}
                          highlightedScriptId={overwriteTarget?.id ?? null}
                          onSelect={(n) => {
                            setSelectedFolderId(n.id);
                            setSelectedFolderName(n.name);
                            setOverwriteTarget(null);
                            setConfirmOverwrite(false);
                          }}
                          onDoubleClick={() => {}}
                          onDelete={() => {}}
                          onSelectScript={handleSelectScriptForOverwrite}
                          expandedIds={expandedIds}
                          toggleExpanded={toggleExpanded}
                          mode="save"
                          isDisabled={node.id === "script-library"}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
            <Input
              placeholder="Script name..."
              value={saveName}
              onChange={(e) => {
                setSaveName(e.target.value);
                setOverwriteTarget(null);
                setConfirmOverwrite(false);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              autoFocus
            />
            <Button
              onClick={handleSave}
              disabled={!saveName.trim() || loading}
              className={confirmOverwrite ? "bg-orange-500 hover:bg-orange-600" : ""}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
              {confirmOverwrite
                ? `Overwrite "${overwriteTarget?.name}"?`
                : overwriteTarget
                  ? `Overwrite in ${selectedFolderName}`
                  : `Save to ${selectedFolderName}`}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="max-h-[400px] overflow-auto border rounded-md">
              {loading ? (
                <div className="p-4 flex items-center justify-center text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Loading scripts...
                </div>
              ) : tree.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground text-sm">
                  No saved scripts
                </div>
              ) : (
                <div className="py-1">
                  {tree.map((node) => (
                    <TreeNode
                      key={node.id}
                      node={node}
                      depth={0}
                      selectedId={selectedNode?.id ?? null}
                      onSelect={setSelectedNode}
                      onDoubleClick={handleDoubleClick}
                      onDelete={handleDelete}
                      expandedIds={expandedIds}
                      toggleExpanded={toggleExpanded}
                    />
                  ))}
                </div>
              )}
            </div>
            <Button
              onClick={handleLoad}
              disabled={!selectedNode || selectedNode.type !== "script"}
            >
              Open
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
