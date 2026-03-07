"use client";

interface ResultsPanelProps {
  html: string | null;
}

export function ResultsPanel({ html }: ResultsPanelProps) {
  if (!html) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
        Use <code className="mx-1 px-1.5 py-0.5 bg-muted rounded text-xs font-mono">render(html)</code> to display results here...
      </div>
    );
  }

  return (
    <div
      className="h-full overflow-auto p-3"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
