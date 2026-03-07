"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { ApplicationContext } from "@sitecore-marketplace-sdk/client";
import { useMarketplaceClient } from "@/src/utils/hooks/useMarketplaceClient";

interface ContentItem {
  itemId: string;
  name: string;
  path: string;
  fields: {
    nodes: { name: string; value: string }[];
  };
}

export default function Home() {
  const { client, error, isInitialized } = useMarketplaceClient();
  const [appContext, setAppContext] = useState<ApplicationContext>();
  const [topItem, setTopItem] = useState<ContentItem | null>(null);
  const [itemError, setItemError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!error && isInitialized && client) {
      client
        .query("application.context")
        .then((res) => {
          setAppContext(res.data);
        })
        .catch((err) => {
          console.error("Error retrieving application.context:", err);
        });
    }
  }, [client, error, isInitialized]);

  useEffect(() => {
    if (!appContext || !client) return;

    const sitecoreContextId =
      appContext.resourceAccess?.[0]?.context?.preview;

    if (!sitecoreContextId) {
      setItemError("No Sitecore context ID available in resource access.");
      return;
    }

    setLoading(true);

    client
      .mutate("xmc.authoring.graphql", {
        params: {
          query: { sitecoreContextId },
          body: {
            query: `
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
                      fields(ownFields: true, excludeStandardFields: true) {
                        nodes {
                          name
                          value
                        }
                      }
                    }
                  }
                }
              }
            `,
          },
        },
      })
      .then((res: any) => {
        const children = res.data?.data?.item?.children?.nodes;
        if (children && children.length > 0) {
          setTopItem(children[0]);
        } else {
          setItemError("No content items found under /sitecore/content.");
        }
      })
      .catch((err: any) => {
        console.error("Error fetching content item:", err);
        setItemError(String(err));
      })
      .finally(() => setLoading(false));
  }, [appContext, client]);

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Sitecore Marketplace Extensions</h1>

      <section style={{ marginBottom: "2rem", padding: "1rem", border: "1px solid #ddd", borderRadius: "8px" }}>
        <h2>Top Content Item</h2>
        {!isInitialized && <p>Initializing SDK...</p>}
        {loading && <p>Loading content...</p>}
        {error && <p style={{ color: "red" }}>SDK Error: {String(error)}</p>}
        {itemError && <p style={{ color: "orange" }}>{itemError}</p>}
        {topItem && (
          <div>
            <p><strong>Name:</strong> {topItem.name}</p>
            <p><strong>Path:</strong> {topItem.path}</p>
            <p><strong>ID:</strong> {topItem.itemId}</p>
            {topItem.fields?.nodes?.length > 0 && (
              <>
                <h4>Fields:</h4>
                <ul>
                  {topItem.fields.nodes.map((f) => (
                    <li key={f.name}>
                      <strong>{f.name}:</strong> {f.value}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </section>

      <section>
        <h2>Extensions</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li style={{ marginBottom: "0.5rem" }}>
            <Link href="/standalone-extension">Standalone Extension</Link>
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            <Link href="/fullscreen-extension">Fullscreen Extension</Link>
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            <Link href="/dashboard-widget-extension">Dashboard Widget Extension</Link>
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            <Link href="/custom-field-extension">Custom Field Extension</Link>
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            <Link href="/pages-contextpanel-extension">Pages Context Panel Extension</Link>
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            <Link href="/scripting-console" style={{ fontWeight: "bold", color: "#5a2d82" }}>
              JS Scripting Console
            </Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
