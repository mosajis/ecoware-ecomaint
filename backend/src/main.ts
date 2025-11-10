import swagger from "@elysiajs/swagger";
import crudRoutes from "./routes/crud";
import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { pluginErrorHandler } from "./plugins/error.plugin";
import { staticPlugin } from "@elysiajs/static";
import { allRoutes } from "./routes/routes";

const app = new Elysia()
  // CORS
  .use(
    cors({
      origin: ["http://localhost:5173"],
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  )
  // error handler
  .use(pluginErrorHandler)
  // mount auto CRUD
  .use(allRoutes)
  // Swagger docs
  .use(
    swagger({
      path: "/docs",
      documentation: {
        info: {
          title: "Ecoware API",
          version: "1.0.0",
          description: "API documentation",
        },
      },
    })
  )

  // React static
  .use(
    staticPlugin({
      indexHTML: true,
      prefix: "",
    })
  );

app.listen(3000);
console.log(`🚀 Server running on http://localhost:${3000}`);
