import { LazyRoute } from "@/app/router/routes/_components/lazyRoute";
import { protectedRoute } from "@/app/router/routes/protected.routes";
import { createRoute } from "@tanstack/react-router";
import { lazy } from "react";

export const Route = createRoute({
  getParentRoute: () => protectedRoute,
  path: "dashboard",
  component: () => <LazyRoute Component={lazy(() => import("./Dashboard"))} />,
  beforeLoad: () => ({ breadcrumb: "Dashboard" }),
});

export default Route;
