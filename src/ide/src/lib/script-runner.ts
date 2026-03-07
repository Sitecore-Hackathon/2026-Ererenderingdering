import type { SitecoreHelpers } from "./sitecore-helpers";

export interface ConsoleEntry {
  level: "log" | "warn" | "error" | "info";
  args: any[];
  timestamp: number;
}

export interface ScriptResult {
  consoleOutput: ConsoleEntry[];
  htmlOutput: string | null;
  returnValue: any;
  error: Error | null;
  duration: number;
}

export async function runScript(
  code: string,
  sitecoreHelpers: SitecoreHelpers
): Promise<ScriptResult> {
  const consoleOutput: ConsoleEntry[] = [];
  let htmlOutput: string | null = null;

  function print(...args: any[]) {
    consoleOutput.push({
      level: "log",
      args: args.map(serializeArg),
      timestamp: Date.now(),
    });
  }

  function render(html: string) {
    htmlOutput = html;
  }

  const originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error,
    info: console.info,
  };

  const proxyConsole: Record<string, (...args: any[]) => void> = {};
  for (const level of ["log", "warn", "error", "info"] as const) {
    proxyConsole[level] = (...args: any[]) => {
      consoleOutput.push({
        level,
        args: args.map(serializeArg),
        timestamp: Date.now(),
      });
      originalConsole[level](...args);
    };
  }

  const start = performance.now();
  let returnValue: any = undefined;
  let error: Error | null = null;

  try {
    // AsyncFunction allows top-level await
    const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
    const fn = new AsyncFunction(
      "Sitecore",
      "print",
      "render",
      "console",
      code
    );
    returnValue = await fn(sitecoreHelpers, print, render, proxyConsole);
  } catch (e) {
    error = e instanceof Error ? e : new Error(String(e));
    consoleOutput.push({
      level: "error",
      args: [error.message],
      timestamp: Date.now(),
    });
  }

  const duration = performance.now() - start;

  return { consoleOutput, htmlOutput, returnValue, error, duration };
}

function serializeArg(arg: any): string {
  if (arg === undefined) return "undefined";
  if (arg === null) return "null";
  if (typeof arg === "string") return arg;
  try {
    return JSON.stringify(arg, null, 2);
  } catch {
    return String(arg);
  }
}
