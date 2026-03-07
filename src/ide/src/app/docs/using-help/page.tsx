import { readFileSync } from "fs";
import { join } from "path";
import { MarkdownPage } from "@/src/components/markdown-page";

export default function UsingHelpPage() {
  const content = readFileSync(
    join(process.cwd(), "docs", "using-help.md"),
    "utf-8"
  );
  return <MarkdownPage content={content} />;
}
