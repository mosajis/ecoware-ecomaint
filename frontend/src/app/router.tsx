import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routes";

const router = createRouter({ routeTree });

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
