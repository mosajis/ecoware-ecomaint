import { createDetailRoute } from "@/app/router/routes/_components/DetailRoute";
import { LazyRoute } from "@/app/router/routes/_components/lazyRoute";
import { protectedRoute } from "@/app/router/routes/protected.routes";
import { createRoute, Outlet } from "@tanstack/react-router";
import { lazy } from "react";

export const Route = createRoute({
  getParentRoute: () => protectedRoute,
  path: "dashboard",
  component: () => <Outlet />,
  beforeLoad: () => ({ breadcrumb: "Dashboard" }),
});

export const RouteLocal = createRoute({
  getParentRoute: () => Route,
  path: "local",
  component: () => <LazyRoute Component={lazy(() => import("./Dashboard"))} />,
  beforeLoad: () => ({ breadcrumb: "Local" }),
});

export const RouteOverall = createRoute({
  getParentRoute: () => Route,
  path: "overall",
  component: () => (
    <LazyRoute Component={lazy(() => import("./DashboardOverall"))} />
  ),
  beforeLoad: () => ({ breadcrumb: "Overall" }),
});

Route.addChildren([RouteLocal, RouteOverall]);

export default Route;
