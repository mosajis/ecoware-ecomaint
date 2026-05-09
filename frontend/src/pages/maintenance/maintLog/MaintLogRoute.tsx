import { createDetailRoute } from "@/app/router/routes/_components/DetailRoute";
import { LazyRoute } from "@/app/router/routes/_components/lazyRoute";
import { routeMaintenance } from "@/pages/maintenance/MaintenanceRoutes";
import { createRoute, Outlet } from "@tanstack/react-router";
import { lazy } from "react";

export const Route = createRoute({
  getParentRoute: () => routeMaintenance,
  path: "maint-log",
  component: () => <Outlet />,
  beforeLoad: () => ({ breadcrumb: "MaintLog" }),
});

export const RouteList = createRoute({
  getParentRoute: () => Route,
  path: "/",
  component: () => <LazyRoute Component={lazy(() => import("./MaintLog"))} />,
  beforeLoad: () => ({ breadcrumb: "List" }),
});

export const RouteDetail = createDetailRoute({
  parent: Route,
  path: "$id",
  Component: () => (
    <LazyRoute Component={lazy(() => import("./MaintLogDetail"))} />
  ),
});

const routes = Route.addChildren([RouteList, RouteDetail]);

export default routes;
