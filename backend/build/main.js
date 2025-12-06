import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { pluginErrorHandler } from "./plugins/error.plugin";
import { staticPlugin } from "@elysiajs/static";
import { allRoutes } from "./routes/routes";
import { openapi } from "@elysiajs/openapi";
const app = new Elysia()
    // CORS
    .use(cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}))
    // Error handler
    .use(pluginErrorHandler)
    // API routes
    .use(allRoutes)
    // OpenAPI plugin
    .use(openapi({
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
}))
    .use(staticPlugin({
    indexHTML: true,
    prefix: "",
}));
// تعیین پورت
const portArgIndex = process.argv.findIndex((arg) => arg === "--port");
const portArg = process.argv[portArgIndex + 1];
const port = portArgIndex !== -1 && portArg ? parseInt(portArg, 10) : 5273;
// اجرای سرور
const info = app.listen(port);
const environment = info?.server?.development ? "development" : "production";
const origin = info?.server?.url.origin;
console.log(`🚀 Server[${environment}] running on ${origin}`);
