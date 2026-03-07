"use client";

import { useEffect, useRef } from "react";
import type { ConsoleEntry } from "@/src/lib/script-runner";

const levelColors: Record<ConsoleEntry["level"], string> = {
  log: "text-[#d4d4d4]",
  info: "text-blue-400",
  warn: "text-yellow-400",
  error: "text-red-400",
};

const levelLabels: Record<ConsoleEntry["level"], string> = {
  log: "LOG",
  info: "INF",
  warn: "WRN",
  error: "ERR",
};

interface ConsoleOutputProps {
  entries: ConsoleEntry[];
}

export function ConsoleOutput({ entries }: ConsoleOutputProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [entries]);

  if (entries.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm font-mono">
        Run a script to see output here...
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto p-2 font-mono text-xs leading-relaxed bg-[#1e1e1e] text-[#d4d4d4]">
      {entries.map((entry, i) => {
        const time = new Date(entry.timestamp).toLocaleTimeString();
        return (
          <div key={i} className="flex gap-2 py-0.5">
            <span className="text-muted-foreground shrink-0">{time}</span>
            <span className={`shrink-0 font-semibold ${levelColors[entry.level]}`}>
              [{levelLabels[entry.level]}]
            </span>
            <span className="whitespace-pre-wrap break-all">
              {entry.args.join(" ")}
            </span>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
