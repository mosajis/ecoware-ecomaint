import { LazyRoute } from "@/app/router/routes/_components/lazyRoute";
import { protectedRoute } from "@/app/router/routes/protected.routes";
import { createRoute, Outlet } from "@tanstack/react-router";
import { lazy } from "react";

export const Route = createRoute({
  getParentRoute: () => protectedRoute,
  path: "waiting",
  component: () => <Outlet />,
  beforeLoad: () => ({ breadcrumb: "Waiting" }),
});

export const RouteDashboard = createRoute({
  getParentRoute: () => Route,
  path: "dashboard",
  component: () => (
    <LazyRoute Component={lazy(() => import("./dashboard/Dashboard"))} />
  ),
  beforeLoad: () => ({ breadcrumb: "Dashboard" }),
});

export const RouteAnalysis = createRoute({
  getParentRoute: () => Route,
  path: "analysis",
  component: () => (
    <LazyRoute Component={lazy(() => import("./analysis/Analysis"))} />
  ),
  beforeLoad: () => ({ breadcrumb: "Analysis" }),
});

Route.addChildren([RouteDashboard, RouteAnalysis]);

export default Route;
