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
import { Trash2, Loader2, ChevronRight, Folder, FolderOpen, FileCode2 } from "lucide-react";
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
  onSelect,
  onDoubleClick,
  onDelete,
  expandedIds,
  toggleExpanded,
}: {
  node: ScriptTreeNode;
  depth: number;
  selectedId: string | null;
  onSelect: (node: ScriptTreeNode) => void;
  onDoubleClick: (node: ScriptTreeNode) => void;
  onDelete: (id: string) => void;
  expandedIds: Set<string>;
  toggleExpanded: (id: string) => void;
}) {
  const isFolder = node.type === "folder";
  const isExpanded = expandedIds.has(node.id);
  const isSelected = selectedId === node.id;

  return (
    <>
      <div
        className={`flex items-center gap-1 px-2 py-1 cursor-pointer hover:bg-accent transition-colors select-none ${
          isSelected ? "bg-accent" : ""
        }`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => {
          if (isFolder) {
            toggleExpanded(node.id);
          } else {
            onSelect(node);
          }
        }}
        onDoubleClick={() => {
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
        <span className="text-sm truncate flex-1">{node.name}</span>
        {!isFolder && (
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
          onSelect={onSelect}
          onDoubleClick={onDoubleClick}
          onDelete={onDelete}
          expandedIds={expandedIds}
          toggleExpanded={toggleExpanded}
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
  const [loading, setLoading] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const loadTree = useCallback(async () => {
    setLoading(true);
    try {
      const t = await backend.listTree();
      setTree(t);
      // Auto-expand top-level folders
      setExpandedIds(new Set(t.map((n) => n.id)));
    } catch {
      setTree([]);
    }
    setLoading(false);
  }, [backend]);

  useEffect(() => {
    if (open) {
      setSaveName("");
      setSelectedNode(null);
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
    setLoading(true);
    const script = await backend.saveScript(saveName.trim(), currentCode);
    setLoading(false);
    onSaved?.(script);
    onOpenChange(false);
  }

  function handleLoad() {
    if (!selectedNode || selectedNode.type !== "script") return;
    onLoad?.({
      id: selectedNode.id,
      name: selectedNode.name,
      code: selectedNode.code ?? "",
      lastModified: Date.now(),
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
      name: node.name,
      code: node.code ?? "",
      lastModified: Date.now(),
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
