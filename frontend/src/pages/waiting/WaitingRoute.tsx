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

export const RouteAnalysis = createRoute({
  getParentRoute: () => Route,
  path: "analysis",
  component: () => (
    <LazyRoute Component={lazy(() => import("./analysis/Analysis"))} />
  ),
  beforeLoad: () => ({ breadcrumb: "Analysis" }),
});

Route.addChildren([RouteAnalysis]);

export default Route;
