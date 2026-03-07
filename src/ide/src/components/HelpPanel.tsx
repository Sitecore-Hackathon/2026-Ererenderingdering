"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronRight, ChevronDown, Copy, X } from "lucide-react";
import helpData from "@/src/lib/help-data.json";

type HelpMethod = (typeof helpData.methods)[keyof typeof helpData.methods];

interface HelpPanelProps {
  onInsertSnippet?: (snippet: string) => void;
  onClose: () => void;
}

const dangerColors: Record<string, string> = {
  safe: "bg-green-500/15 text-green-700 dark:text-green-400",
  mutating: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400",
  destructive: "bg-red-500/15 text-red-700 dark:text-red-400",
};

function DangerBadge({ level }: { level: string }) {
  return (
    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${dangerColors[level] ?? ""}`}>
      {level}
    </span>
  );
}

function MethodCard({ method, expanded, onToggle, onInsert }: {
  method: HelpMethod;
  expanded: boolean;
  onToggle: () => void;
  onInsert?: () => void;
}) {
  return (
    <div className="border rounded-md mb-1.5 bg-card">
      <button
        onClick={onToggle}
        className="w-full text-left px-2.5 py-1.5 flex items-center gap-1.5 hover:bg-muted/50 transition-colors"
      >
        {expanded ? <ChevronDown className="h-3 w-3 shrink-0" /> : <ChevronRight className="h-3 w-3 shrink-0" />}
        <span className="font-mono text-xs font-medium truncate">{method.name}</span>
        <DangerBadge level={method.danger} />
      </button>

      {!expanded && (
        <p className="text-[11px] text-muted-foreground px-2.5 pb-1.5 line-clamp-1">
          {method.description}
        </p>
      )}

      {expanded && (
        <div className="px-2.5 pb-2.5 space-y-2">
          <code className="block text-[11px] bg-muted/50 rounded px-2 py-1 overflow-x-auto whitespace-pre-wrap break-all">
            {method.qualifiedName}{method.signature.replace(/^\(/, "(\n  ").replace(/, /g, ",\n  ").replace(/\) =>/, "\n) =>")}
          </code>

          <p className="text-xs text-muted-foreground">{method.description}</p>

          {method.params.length > 0 && (
            <div>
              <h4 className="text-[11px] font-semibold mb-1">Parameters</h4>
              <div className="space-y-0.5">
                {method.params.map((p) => (
                  <div key={p.name} className="text-[11px]">
                    <span className="font-mono text-primary">{p.name}</span>
                    {p.optional && <span className="text-muted-foreground">?</span>}
                    <span className="text-muted-foreground">: {p.type}</span>
                    {p.description && <span className="text-muted-foreground ml-1">— {p.description}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {method.returns && (
            <div className="text-[11px]">
              <span className="font-semibold">Returns: </span>
              <span className="font-mono text-muted-foreground">{method.returns}</span>
            </div>
          )}

          {method.examples.length > 0 && (
            <div>
              <h4 className="text-[11px] font-semibold mb-1">Example</h4>
              {method.examples.map((ex, i) => (
                <pre key={i} className="text-[11px] bg-muted/50 rounded px-2 py-1 overflow-x-auto whitespace-pre-wrap">
                  {ex}
                </pre>
              ))}
            </div>
          )}

          {onInsert && (
            <Button size="sm" variant="secondary" className="h-6 text-[11px]" onClick={onInsert}>
              <Copy className="h-3 w-3 mr-1" />
              Insert
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export function HelpPanel({ onInsertSnippet, onClose }: HelpPanelProps) {
  const [search, setSearch] = useState("");
  const [expandedMethod, setExpandedMethod] = useState<string | null>(null);
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());

  const allMethods = useMemo(() => Object.values(helpData.methods) as HelpMethod[], []);

  const filtered = useMemo(() => {
    if (!search.trim()) return null;
    const q = search.toLowerCase();
    return allMethods.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.qualifiedName.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q)
    );
  }, [search, allMethods]);

  const toggleCategory = (id: string) => {
    setCollapsedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const renderMethodList = (methods: HelpMethod[]) =>
    methods.map((m) => (
      <MethodCard
        key={m.name}
        method={m}
        expanded={expandedMethod === m.name}
        onToggle={() => setExpandedMethod(expandedMethod === m.name ? null : m.name)}
        onInsert={onInsertSnippet ? () => onInsertSnippet(m.snippet) : undefined}
      />
    ));

  return (
    <div className="w-80 border-l flex flex-col h-full bg-background">
      <div className="flex items-center justify-between px-3 py-2 border-b">
        <h3 className="text-sm font-semibold">API Reference</h3>
        <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="px-3 py-2">
        <Input
          placeholder="Search methods..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-7 text-xs"
        />
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-3">
        {filtered ? (
          <>
            <p className="text-[11px] text-muted-foreground mb-2">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </p>
            {renderMethodList(filtered)}
          </>
        ) : (
          helpData.categories.map((cat) => {
            const isCollapsed = collapsedCategories.has(cat.id);
            const methods = cat.methods
              .map((name) => (helpData.methods as Record<string, HelpMethod>)[name])
              .filter(Boolean);

            return (
              <div key={cat.id} className="mb-2">
                <button
                  onClick={() => toggleCategory(cat.id)}
                  className="flex items-center gap-1 w-full text-left py-1 hover:text-primary transition-colors"
                >
                  {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  <span className="text-xs font-semibold">{cat.name}</span>
                  <span className="text-[10px] text-muted-foreground ml-auto">{methods.length}</span>
                </button>
                {!isCollapsed && (
                  <div className="ml-1 mt-0.5">
                    {renderMethodList(methods)}
                  </div>
                )}
                <Separator className="mt-1" />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
