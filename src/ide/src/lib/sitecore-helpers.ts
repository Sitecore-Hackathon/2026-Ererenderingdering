import type { ClientSDK } from "@sitecore-marketplace-sdk/client";

export interface SitecoreHelpers {
  getContext: () => Promise<any>;
  graphql: (query: string, variables?: Record<string, any>) => Promise<any>;
  listSites: () => Promise<any>;
  retrievePage: (pageId: string, site: string, language?: string) => Promise<any>;
  reloadCanvas: () => Promise<void>;
  navigateTo: (itemId: string) => Promise<void>;
  getItem: (path: string) => Promise<any>;
  updateItem: (id: string, path: string, fields: Record<string, string>) => Promise<any>;
}

function unwrap(res: any): any {
  if (res?.isError || res?.status === "error") {
    const msg = res.error?.message || res.error?.detail || JSON.stringify(res.error) || "Unknown SDK error";
    throw new Error(`SDK error: ${msg}`);
  }
  return res?.data ?? res;
}

export function createSitecoreHelpers(client: ClientSDK): SitecoreHelpers {
  let cachedContextId: string | null = null;

  async function getSitecoreContextId(): Promise<string> {
    if (cachedContextId) return cachedContextId;
    const res = await client.query("application.context");
    const ctx = res.data;
    cachedContextId = ctx?.resourceAccess?.[0]?.context?.preview ?? null;
    if (!cachedContextId) {
      throw new Error("No Sitecore context ID available in resource access");
    }
    return cachedContextId;
  }

  return {
    async getContext() {
      const res = await client.query("application.context");
      return res.data;
    },

    async graphql(query: string, variables?: Record<string, any>) {
      const sitecoreContextId = await getSitecoreContextId();
      const res = await client.mutate("xmc.authoring.graphql", {
        params: {
          query: { sitecoreContextId },
          body: { query, variables },
        },
      });
      return unwrap(res);
    },

    async listSites() {
      const sitecoreContextId = await getSitecoreContextId();
      const res = await client.mutate("xmc.authoring.graphql", {
        params: {
          query: { sitecoreContextId },
          body: {
            query: `
              query {
                sites {
                  name
                  hostName
                  language
                  rootPath
                }
              }
            `,
          },
        },
      });
      const data = unwrap(res);
      return data?.data?.sites ?? data;
    },

    async retrievePage(pageId: string, site: string, language?: string) {
      const sitecoreContextId = await getSitecoreContextId();
      const res = await (client as any).query("xmc.pages.retrievePage", {
        params: {
          query: { sitecoreContextId, sc_site: site, sc_lang: language ?? "en" },
          path: { pageId },
        },
      });
      return unwrap(res);
    },

    async reloadCanvas() {
      await (client as any).mutate("pages.reloadCanvas");
    },

    async navigateTo(itemId: string) {
      await (client as any).mutate("pages.context", {
        params: { body: { itemId } },
      });
    },

    async getItem(path: string) {
      const sitecoreContextId = await getSitecoreContextId();
      const res = await client.mutate("xmc.authoring.graphql", {
        params: {
          query: { sitecoreContextId },
          body: {
            query: `
              query GetItem($path: String!) {
                item(where: { database: "master", path: $path }) {
                  itemId
                  name
                  path
                  fields(ownFields: true, excludeStandardFields: true) {
                    nodes { name value }
                  }
                  children {
                    nodes {
                      itemId
                      name
                      path
                    }
                  }
                }
              }
            `,
            variables: { path },
          },
        },
      });
      return (res as any).data?.data?.item;
    },

    async updateItem(id: string, path: string, fields: Record<string, string>) {
      const fieldInputs = Object.entries(fields).map(([name, value]) => ({
        name,
        value,
      }));
      const sitecoreContextId = await getSitecoreContextId();
      const res = await client.mutate("xmc.authoring.graphql", {
        params: {
          query: { sitecoreContextId },
          body: {
            query: `
              mutation UpdateItem($itemId: ID!, $fields: [FieldValueInput!]!) {
                updateItem(
                  input: { itemId: $itemId, fields: $fields, database: "master" }
                ) {
                  item {
                    itemId
                    name
                    path
                  }
                }
              }
            `,
            variables: { itemId: id, fields: fieldInputs },
          },
        },
      });
      return (res as any).data?.data?.updateItem;
    },
  };
}
