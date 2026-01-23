import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { staticPlugin } from "@elysiajs/static";
import { openapi } from "@elysiajs/openapi";
import { readFile } from "node:fs/promises";

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

const app = new Elysia()

  /* ---------------- CORS ---------------- */
  .use(
    cors({
      origin: ["http://localhost:5173"],
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  )

  /* ------------ Error handler ------------ */
  .use(pluginErrorHandler)

  /* --------------- API ------------------ */
  .use(allRoutes)

  /* ------------- OpenAPI ---------------- */
  .use(
    openapi({
      path: "/docs",
      specPath: "/docs/json",
      provider: "scalar",
      documentation: {
        info: {
          title: "ECO | API",
          version: "1.0.0",
          description: "API documentation",
        },
      },
    }),
  )

  /* -------- Static assets only --------- */
  .use(
    staticPlugin({
      assets: "public/assets",
      prefix: "/assets",
    }),
  )

  /* --------------- Health --------------- */
  .get("/health", () => "OK")

  /* ------------- SPA entry -------------- */
  .get("/", async ({ set }) => {
    set.headers["content-type"] = "text/html; charset=utf-8";
    return await renderIndexHtml();
  })

  /* -------- SPA fallback (React) -------- */
  .get("/*", async ({ set }) => {
    set.headers["content-type"] = "text/html; charset=utf-8";
    return await renderIndexHtml();
  });

/* -------- Init dirs before listen ------- */
await initializeUploadDirs();

/* --------------- Server ---------------- */
const port = Number(process.argv[process.argv.indexOf("--port") + 1]) || 5273;

const info = app.listen(port);
const env = info?.server?.development ? "development" : "production";

console.log(`🚀 Server[${env}] running on ${info?.server?.url.origin}`);
