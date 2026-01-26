import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routesTree } from "./routes";

const router = createRouter({ routeTree: routesTree });

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
