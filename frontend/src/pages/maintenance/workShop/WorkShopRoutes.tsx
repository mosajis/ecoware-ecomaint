import { createDetailRoute } from "@/app/router/routes/_components/DetailRoute";
import { LazyRoute } from "@/app/router/routes/_components/lazyRoute";
import { routeMaintenance } from "@/app/router/routes/maintenance.routes";
import { createRoute, Outlet } from "@tanstack/react-router";
import { lazy } from "react";

const Route = createRoute({
  getParentRoute: () => routeMaintenance,
  path: "workshop",
  component: () => <Outlet />,
  beforeLoad: () => ({ breadcrumb: "WorkShop" }),
});

const RouteList = createRoute({
  getParentRoute: () => Route,
  path: "/",
  component: () => (
    <LazyRoute
      Component={lazy(() => import("@/pages/maintenance/workShop/WorkShop"))}
    />
  ),
  beforeLoad: () => ({ breadcrumb: "List" }),
});

export const RouteDetail = createDetailRoute({
  parent: Route,
  path: "$id",
  Component: () => (
    <LazyRoute
      Component={lazy(
        () => import("@/pages/maintenance/workShop/WorkShopDetail"),
      )}
    />
  ),
});

Route.addChildren([RouteList, RouteDetail]);

export default Route;
