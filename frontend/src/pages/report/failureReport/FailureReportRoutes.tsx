import { createDetailRoute } from "@/app/router/routes/_components/DetailRoute";
import { LazyRoute } from "@/app/router/routes/_components/lazyRoute";
import { protectedRoute } from "@/app/router/routes/protected.routes";
import { createRoute, Outlet } from "@tanstack/react-router";
import { lazy } from "react";
import ReportRoute from "../ReportRoutes";

// --- General parent route ---
export const Route = createRoute({
  getParentRoute: () => ReportRoute,
  path: "failure",
  component: () => <Outlet />,
  beforeLoad: () => ({ breadcrumb: "Failure" }),
});

// --- General children ---
export const RouteList = createRoute({
  getParentRoute: () => Route,
  path: "/",
  component: () => (
    <LazyRoute Component={lazy(() => import("./FailureReport"))} />
  ),
  beforeLoad: () => ({ breadcrumb: "List" }),
});

export const RouteDetail = createDetailRoute({
  parent: Route,
  path: "$id",
  Component: () => (
    <LazyRoute Component={lazy(() => import("./FailureReportDetail"))} />
  ),
});

const routes = Route.addChildren([RouteList, RouteDetail]);

export default routes;
