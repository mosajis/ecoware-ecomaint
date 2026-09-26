import { pluginErrorHandler } from "@/plugins/error.plugin";
import { allRoutes } from "@/routes/routes";
import { Elysia } from "elysia";

export const app = new Elysia().use(pluginErrorHandler).use(allRoutes);

export async function api(
  method: "GET" | "POST" | "PUT" | "DELETE",
  path: string,
  options: {
    body?: unknown;
    token?: string;
    headers?: Record<string, string>;
  } = {},
) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (options.token) {
    headers["Authorization"] = `Bearer ${options.token}`;
  }

  const response = await app.handle(
    new Request(`http://localhost${path}`, {
      method,
      headers,
      body:
        options.body !== undefined ? JSON.stringify(options.body) : undefined,
    }),
  );

  const status = response.status;
  let json: any = null;
  try {
    json = await response.json();
  } catch {
    // some responses might not have body (like 204)
  }

  return { status, json, response };
}
