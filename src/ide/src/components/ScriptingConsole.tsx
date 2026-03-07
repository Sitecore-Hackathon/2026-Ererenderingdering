"use client";

import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMarketplaceClient } from "@/src/utils/hooks/useMarketplaceClient";
import { createSitecoreHelpers } from "@/src/lib/sitecore-helpers";
import { runScript, type ConsoleEntry } from "@/src/lib/script-runner";
import { createLocalScriptStorage, type ScriptStorageBackend } from "@/src/lib/script-storage";
import { createSitecoreScriptStorage } from "@/src/lib/sitecore-script-storage";
import { installModule } from "@/src/lib/item-installer";
import { MonacoEditor, type MonacoEditorHandle } from "./MonacoEditor";
import { Toolbar } from "./Toolbar";
import { ConsoleOutput } from "./ConsoleOutput";
import { ResultsPanel } from "./ResultsPanel";
import { ScriptLibraryDialog } from "./ScriptLibraryDialog";

const DEFAULT_CODE = `// Sitecore JS Scripting Console
// Use Sitecore.* (or sc.* shorthand), print(), and render()
// Press Ctrl+Enter to run

const ctx = await sc.getContext();
print("Application context loaded:");
print(JSON.stringify(ctx, null, 2));
`;

export function ScriptingConsole() {
  const { client, isInitialized } = useMarketplaceClient();
  const editorRef = useRef<MonacoEditorHandle>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [consoleEntries, setConsoleEntries] = useState<ConsoleEntry[]>([]);
  const [htmlOutput, setHtmlOutput] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("console");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"save" | "load">("save");
  const [outputHeight, setOutputHeight] = useState(250);
  const isDragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [storageBackend, setStorageBackend] = useState<ScriptStorageBackend>(
    () => createLocalScriptStorage()
  );
  const [storageMode, setStorageMode] = useState<"sitecore" | "local">("local");

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!isDragging.current || !containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const newHeight = containerRect.bottom - e.clientY;
      setOutputHeight(Math.max(80, Math.min(newHeight, containerRect.height - 100)));
    }
    function onMouseUp() {
      isDragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  const helpers = useMemo(() => {
    if (!client) return null;
    return createSitecoreHelpers(client);
  }, [client]);

  // Install module and set up storage backend when helpers become available
  useEffect(() => {
    if (!helpers) return;
    let cancelled = false;

    (async () => {
      const result = await installModule(helpers);
      if (cancelled) return;

      if (result.storageMode === "sitecore") {
        setStorageBackend(createSitecoreScriptStorage(helpers));
        setStorageMode("sitecore");
      } else {
        setStorageBackend(createLocalScriptStorage());
        setStorageMode("local");
      }
    })();

    return () => { cancelled = true; };
  }, [helpers]);

  const handleRun = useCallback(async () => {
    if (!helpers || !editorRef.current) return;
    const code = editorRef.current.getValue();
    if (!code.trim()) return;

    setIsRunning(true);
    setActiveTab("console");

    const result = await runScript(code, helpers);

    setConsoleEntries((prev) => [
      ...prev,
      {
        level: "info",
        args: [`--- Script executed in ${result.duration.toFixed(1)}ms ---`],
        timestamp: Date.now(),
      },
      ...result.consoleOutput,
    ]);

    if (result.htmlOutput) {
      setHtmlOutput(result.htmlOutput);
      setActiveTab("results");
    }

    if (result.returnValue !== undefined && !result.error) {
      setConsoleEntries((prev) => [
        ...prev,
        {
          level: "info",
          args: [
            "=> " +
              (typeof result.returnValue === "string"
                ? result.returnValue
                : JSON.stringify(result.returnValue, null, 2)),
          ],
          timestamp: Date.now(),
        },
      ]);
    }

    setIsRunning(false);
  }, [helpers]);

  const handleSave = useCallback(() => {
    setDialogMode("save");
    setDialogOpen(true);
  }, []);

  const handleLoad = useCallback(() => {
    setDialogMode("load");
    setDialogOpen(true);
  }, []);

  const handleClear = useCallback(() => {
    setConsoleEntries([]);
    setHtmlOutput(null);
  }, []);

  return (
    <div ref={containerRef} className="h-screen flex flex-col bg-background">
      <Toolbar
        onRun={handleRun}
        onSave={handleSave}
        onLoad={handleLoad}
        onClear={handleClear}
        isRunning={isRunning}
        isClientReady={isInitialized && !!client}
        storageMode={storageMode}
      />

      <div className="flex-1 min-h-0">
        <MonacoEditor
          ref={editorRef}
          defaultValue={DEFAULT_CODE}
          onRunShortcut={handleRun}
        />
      </div>

      {/* Drag handle */}
      <div
        className="h-2 bg-border hover:bg-primary/40 active:bg-primary/50 cursor-row-resize shrink-0 transition-colors flex items-center justify-center"
        onMouseDown={(e) => {
          e.preventDefault();
          isDragging.current = true;
          document.body.style.cursor = "row-resize";
          document.body.style.userSelect = "none";
        }}
      >
        <div className="w-10 h-0.5 rounded-full bg-muted-foreground/40" />
      </div>

      <div style={{ height: outputHeight }} className="flex flex-col min-h-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
          <TabsList variant="line" className="px-2 border-b">
            <TabsTrigger value="console" className="text-xs">
              Console
            </TabsTrigger>
            <TabsTrigger value="results" className="text-xs">
              Results
            </TabsTrigger>
          </TabsList>
          <TabsContent value="console" className="flex-1 m-0 min-h-0">
            <ConsoleOutput entries={consoleEntries} />
          </TabsContent>
          <TabsContent value="results" className="flex-1 m-0 min-h-0">
            <ResultsPanel html={htmlOutput} />
          </TabsContent>
        </Tabs>
      </div>

      <ScriptLibraryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={dialogMode}
        currentCode={editorRef.current?.getValue() ?? ""}
        onLoad={(script) => editorRef.current?.setValue(script.code)}
        backend={storageBackend}
      />
    </div>
  );
}
