import path from "node:path";
import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { staticPlugin } from "@elysiajs/static";
import { openapi } from "@elysiajs/openapi";
import { readFile } from "node:fs/promises";
import { readFileSync } from "node:fs";

import { pluginErrorHandler } from "./plugins/error.plugin";
import { allRoutes } from "./routes/routes";
import { initializeUploadDirs } from "./utils/file.init";

let cachedHtml: string | null = null;

async function renderIndexHtml() {
  if (!cachedHtml) {
    cachedHtml = await readFile("public/index.html", "utf-8");
  }
  return cachedHtml;
}

/* ---------------- ENV ---------------- */
const MODE = process.env.NODE_ENV ?? "development";
const SSL_ENABLED =
  process.env.SSL_ENABLED === "true" || process.env.SSL_ENABLED === "1";
const isProd = MODE === "production";

/* ---------------- PORTS ---------------- */
const HTTPS_PORT = isProd ? 443 : 5273;
const HTTP_PORT = isProd ? 80 : 5274;

/* ---------------- TLS ---------------- */
const tls = SSL_ENABLED
  ? {
      key: readFileSync(process.env.SSL_KEY_PATH ?? "./ssl/key.pem"),
      cert: readFileSync(process.env.SSL_CERT_PATH ?? "./ssl/cert.pem"),
    }
  : undefined;

/* ---------------- APP ---------------- */
const app = new Elysia()
  .use(
    cors({
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "x-inst-id"],
      exposeHeaders: ["Content-Disposition"],
    }),
  )
  .use(
    openapi({
      enabled: !isProd,
      path: "/docs",
      specPath: "/docs/json",
      documentation: {
        info: {
          title: "ECO | API",
          version: "1.0.0",
          description: "API documentation",
        },
      },
    }),
  )
  .use(
    staticPlugin({
      assets: path.join(process.cwd(), "public/assets"),
      prefix: "/assets",
    }),
  )
  .use(pluginErrorHandler)
  .use(allRoutes)

  .get("/", async ({ set }) => {
    set.headers["content-type"] = "text/html; charset=utf-8";
    return renderIndexHtml();
  })

  .get("*", async ({ set, request }) => {
    const pathname = new URL(request.url).pathname;

    if (pathname.startsWith("/assets")) {
      return new Response("Not Found", { status: 404 });
    }

    set.headers["content-type"] = "text/html; charset=utf-8";
    return renderIndexHtml();
  });

/* ---------------- INIT ---------------- */
await initializeUploadDirs();

/* ---------------- HTTP SERVER (redirect or dev) ---------------- */
if (SSL_ENABLED) {
  Bun.serve({
    port: HTTP_PORT,
    fetch(req) {
      const url = new URL(req.url);
      url.protocol = "https:";
      url.port = String(HTTPS_PORT);
      return Response.redirect(url.toString(), 301);
    },
  });
}

/* ---------------- MAIN SERVER ---------------- */
const server = app.listen({
  port: HTTPS_PORT,
  tls,
});

console.log(
  `🚀 ${MODE.toUpperCase()} | ${SSL_ENABLED ? "HTTPS" : "HTTP"} | ${server.server?.url.origin}`,
);
