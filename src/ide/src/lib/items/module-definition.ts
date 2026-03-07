export const MODULE_VERSION = "1.0.0";
export const MODULE_ROOT_PATH = "/sitecore/system/Modules/JavaScript Extensions";
export const TEMPLATES_ROOT_PATH = "/sitecore/templates/Modules/JavaScript Extensions";
export const SCRIPT_LIBRARY_PATH = MODULE_ROOT_PATH + "/Script Library";
export const USER_SCRIPTS_PATH = SCRIPT_LIBRARY_PATH + "/User Scripts";
export const EXAMPLES_PATH = SCRIPT_LIBRARY_PATH + "/Examples";

// Well-known Sitecore meta-template IDs
export const SITECORE_TEMPLATE_ID = "{AB86861A-6030-46C5-B394-E8F99E8B87DB}";
export const SITECORE_TEMPLATE_SECTION_ID = "{E269FBB5-3750-427A-9149-7AA950B49301}";
export const SITECORE_TEMPLATE_FIELD_ID = "{455A3E98-A627-4B40-8035-E683A0331AC7}";

// Custom template IDs (stable GUIDs for our module)
export const TEMPLATE_IDS = {
  jsScriptModule: "{7A4D6B2E-1F3C-4A8D-9E5B-2C6F8D3A1E4B}",
  jsScriptLibrary: "{3B8E5C1D-4F2A-4D7E-8A6C-9D1F3E5B7C2A}",
  jsScript: "{5C2A8D4E-6B3F-4E1A-9D7C-8F2E4A6B1D3C}",
};

export interface ItemDefinition {
  name: string;
  templateId: string;
  fields?: Record<string, string>;
  children?: ItemDefinition[];
}

// Example script code
const EXAMPLE_SCRIPTS: Record<string, string> = {
  "Get Context": `// Get the current application context
const ctx = await Sitecore.getContext();
print(JSON.stringify(ctx, null, 2));`,

  "List Sites": `// List all sites in XM Cloud
const sites = await Sitecore.listSites();
print(JSON.stringify(sites, null, 2));`,

  "GraphQL Query": `// Query content tree via GraphQL
const result = await Sitecore.graphql(\`
  query {
    item(where: { database: "master", path: "/sitecore/content" }) {
      itemId
      name
      path
      children {
        nodes {
          itemId
          name
          path
        }
      }
    }
  }
\`);
print(JSON.stringify(result, null, 2));`,

  "Render HTML": `// Render custom HTML in the Results tab
const ctx = await Sitecore.getContext();
render(\`
  <div style="font-family: sans-serif; padding: 1rem;">
    <h2>Application Context</h2>
    <p><strong>App Name:</strong> \${ctx.appName || 'N/A'}</p>
    <p><strong>Tenant ID:</strong> \${ctx.tenantId || 'N/A'}</p>
  </div>
\`);`,

  "Get Item": `// Get a content item by path
const item = await Sitecore.getItem("/sitecore/content");
print(JSON.stringify(item, null, 2));`,
};

// Template definitions (created under /sitecore/templates/Modules/JavaScript Extensions/)
export const TEMPLATE_DEFINITIONS: ItemDefinition[] = [
  {
    name: "JS Script Module",
    templateId: SITECORE_TEMPLATE_ID,
    children: [
      {
        name: "Settings",
        templateId: SITECORE_TEMPLATE_SECTION_ID,
        children: [
          {
            name: "Version",
            templateId: SITECORE_TEMPLATE_FIELD_ID,
            fields: { Type: "Single-Line Text" },
          },
        ],
      },
    ],
  },
  {
    name: "JS Script Library",
    templateId: SITECORE_TEMPLATE_ID,
  },
  {
    name: "JS Script",
    templateId: SITECORE_TEMPLATE_ID,
    children: [
      {
        name: "Data",
        templateId: SITECORE_TEMPLATE_SECTION_ID,
        children: [
          {
            name: "Script",
            templateId: SITECORE_TEMPLATE_FIELD_ID,
            fields: { Type: "Multi-Line Text" },
          },
        ],
      },
    ],
  },
];

// Content tree definition
export const MODULE_DEFINITION: ItemDefinition = {
  name: "JavaScript Extensions",
  templateId: TEMPLATE_IDS.jsScriptModule,
  fields: { Version: MODULE_VERSION },
  children: [
    {
      name: "Script Library",
      templateId: TEMPLATE_IDS.jsScriptLibrary,
      children: [
        {
          name: "Examples",
          templateId: TEMPLATE_IDS.jsScriptLibrary,
          children: Object.entries(EXAMPLE_SCRIPTS).map(([name, code]) => ({
            name,
            templateId: TEMPLATE_IDS.jsScript,
            fields: { Script: code },
          })),
        },
        {
          name: "User Scripts",
          templateId: TEMPLATE_IDS.jsScriptLibrary,
        },
      ],
    },
  ],
};
