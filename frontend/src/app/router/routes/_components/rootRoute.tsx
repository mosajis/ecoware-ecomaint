import { NotFound } from "@/pages/NotFound";
import { createRootRoute, Outlet } from "@tanstack/react-router";

// --- Root ---
export const rootRoute = createRootRoute({
  notFoundComponent: NotFound,
  component: () => <Outlet />,
});
