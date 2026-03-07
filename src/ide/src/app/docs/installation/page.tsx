import { readFileSync } from "fs";
import { join } from "path";
import { MarkdownPage } from "@/src/components/markdown-page";

export default function InstallationPage() {
  const content = readFileSync(
    join(process.cwd(), "docs", "installation.md"),
    "utf-8"
  );
  return <MarkdownPage content={content} />;
}
