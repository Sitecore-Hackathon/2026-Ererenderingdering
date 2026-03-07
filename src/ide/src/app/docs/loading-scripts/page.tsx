import { readFileSync } from "fs";
import { join } from "path";
import { MarkdownPage } from "@/src/components/markdown-page";

export default function LoadingScriptsPage() {
  const content = readFileSync(
    join(process.cwd(), "docs", "loading-scripts.md"),
    "utf-8"
  );
  return <MarkdownPage content={content} />;
}
