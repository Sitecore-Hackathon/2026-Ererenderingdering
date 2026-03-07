import Link from "next/link";

const docs = [
  {
    title: "Getting Started",
    description: "Overview, UI layout, and quick start guide",
    href: "/docs/getting-started",
  },
  {
    title: "Installation",
    description: "Clone, build, run locally, and deploy to production",
    href: "/docs/installation",
  },
  {
    title: "Configuration",
    description:
      "App registration, extension points, permissions, and auto-installed items",
    href: "/docs/configuration",
  },
  {
    title: "Running Scripts",
    description:
      "Monaco editor, execution, top-level await, available globals, and error handling",
    href: "/docs/running-scripts",
  },
  {
    title: "Loading Scripts",
    description: "Script Library tree, browsing examples, and opening scripts",
    href: "/docs/loading-scripts",
  },
  {
    title: "Saving Scripts",
    description: "Save, Save As, naming, and overwrite detection",
    href: "/docs/saving-scripts",
  },
  {
    title: "Using Help",
    description:
      "Help panel, categories, search, method cards, danger levels, and in-script help()",
    href: "/docs/using-help",
  },
  {
    title: "Output Functions",
    description:
      "print(), render(), console.*, and formatted display helpers for items, users, roles, and templates",
    href: "/docs/output-functions",
  },
];

export default function DocsIndexPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="mb-2 text-3xl font-bold">Documentation</h1>
      <p className="mb-8 text-muted-foreground">
        Browse the available documentation pages below.
      </p>
      <ul className="space-y-3">
        {docs.map((doc) => (
          <li key={doc.href}>
            <Link
              href={doc.href}
              className="block rounded-lg border border-border p-4 transition-colors hover:bg-muted"
            >
              <span className="font-medium">{doc.title}</span>
              <span className="mt-1 block text-sm text-muted-foreground">
                {doc.description}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
