import { readFileSync } from "fs";
import { join } from "path";
import { MarkdownPage } from "@/src/components/markdown-page";

export default function ConfigurationPage() {
  const content = readFileSync(
    join(process.cwd(), "docs", "configuration.md"),
    "utf-8"
  );
  return <MarkdownPage content={content} />;
}
