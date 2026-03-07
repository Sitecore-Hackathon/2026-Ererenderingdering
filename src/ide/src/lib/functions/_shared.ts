import type { ClientSDK } from "@sitecore-marketplace-sdk/client";

export type GqlFn = (query: string, variables?: Record<string, any>) => Promise<any>;

export interface HelperContext {
  gql: GqlFn;
  client: ClientSDK;
  getSitecoreContextId: () => Promise<string>;
}

export function unwrap(res: any): any {
  if (res?.isError || res?.status === "error") {
    const msg = res.error?.message || res.error?.detail || JSON.stringify(res.error) || "Unknown SDK error";
    throw new Error(`SDK error: ${msg}`);
  }
  return res?.data ?? res;
}

export function isId(s: string): boolean {
  return /^[{(]?[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}[})]?$/i.test(s);
}

export function itemWhere(idOrPath: string, opts?: { language?: string; version?: number; database?: string }): Record<string, any> {
  const where: Record<string, any> = {};
  if (isId(idOrPath)) where.itemId = idOrPath; else where.path = idOrPath;
  if (opts?.language) where.language = opts.language;
  if (opts?.version != null) where.version = opts.version;
  if (opts?.database) where.database = opts.database;
  return where;
}

export function fieldsToInput(fields?: Record<string, string>): { name: string; value: string }[] | undefined {
  if (!fields) return undefined;
  const arr = Object.entries(fields).map(([name, value]) => ({ name, value }));
  return arr.length > 0 ? arr : undefined;
}
