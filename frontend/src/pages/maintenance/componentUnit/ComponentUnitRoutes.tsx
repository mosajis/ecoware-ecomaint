import { createDetailRoute } from "@/app/router/routes/_components/DetailRoute";
import { LazyRoute } from "@/app/router/routes/_components/lazyRoute";
import { routeMaintenance } from "@/app/router/routes/maintenance.routes";
import { createRoute, Outlet } from "@tanstack/react-router";
import { lazy } from "react";

// --- Component Unit ---
export const routeComponentUnit = createRoute({
  getParentRoute: () => routeMaintenance,
  path: "component-unit",
  component: () => <Outlet />,
  beforeLoad: () => ({ breadcrumb: "Component Unit" }),
});

export const routeComponentUnitList = createRoute({
  getParentRoute: () => routeComponentUnit,
  path: "/",
  component: () => (
    <LazyRoute
      Component={lazy(
        () => import("@/pages/maintenance/componentUnit/ComponentUnit"),
      )}
    />
  ),
  beforeLoad: () => ({ breadcrumb: "List" }),
});

export const routeComponentUnitDetail = createDetailRoute({
  parent: routeComponentUnit,
  path: "$id",
  Component: () => (
    <LazyRoute
      Component={lazy(
        () => import("@/pages/maintenance/componentUnit/ComponentUnitDetail"),
      )}
    />
  ),
});

const routes = routeComponentUnit.addChildren([
  routeComponentUnitList,
  routeComponentUnitDetail,
]);

export default routes;
