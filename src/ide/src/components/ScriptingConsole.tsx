"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMarketplaceClient } from "@/src/utils/hooks/useMarketplaceClient";
import { createSitecoreHelpers } from "@/src/lib/sitecore-helpers";
import { runScript, type ConsoleEntry } from "@/src/lib/script-runner";
import { MonacoEditor, type MonacoEditorHandle } from "./MonacoEditor";
import { Toolbar } from "./Toolbar";
import { ConsoleOutput } from "./ConsoleOutput";
import { ResultsPanel } from "./ResultsPanel";
import { ScriptLibraryDialog } from "./ScriptLibraryDialog";

const DEFAULT_CODE = `// Sitecore JS Scripting Console
// Use Sitecore.* methods, print(), and render()
// Press Ctrl+Enter to run

const ctx = await Sitecore.getContext();
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

  const helpers = useMemo(() => {
    if (!client) return null;
    return createSitecoreHelpers(client);
  }, [client]);

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
    <div className="h-screen flex flex-col bg-background">
      <Toolbar
        onRun={handleRun}
        onSave={handleSave}
        onLoad={handleLoad}
        onClear={handleClear}
        isRunning={isRunning}
        isClientReady={isInitialized && !!client}
      />

      <div className="flex-1 min-h-0">
        <MonacoEditor
          ref={editorRef}
          defaultValue={DEFAULT_CODE}
          onRunShortcut={handleRun}
        />
      </div>

      <div className="h-[250px] border-t flex flex-col">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
          <TabsList className="w-fit rounded-none border-b px-2">
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
      />
    </div>
  );
}
