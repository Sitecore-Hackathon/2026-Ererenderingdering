import { readFileSync } from "fs";
import { join } from "path";
import { MarkdownPage } from "@/src/components/markdown-page";

export default function SavingScriptsPage() {
  const content = readFileSync(
    join(process.cwd(), "docs", "saving-scripts.md"),
    "utf-8"
  );
  return <MarkdownPage content={content} />;
}
