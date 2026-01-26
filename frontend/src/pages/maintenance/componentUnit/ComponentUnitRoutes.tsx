import { createDetailRoute } from "@/app/router/routes/_components/DetailRoute";
import { LazyRoute } from "@/app/router/routes/_components/lazyRoute";
import { routeMaintenance } from "@/app/router/routes/maintenance.routes";
import { createRoute, Outlet } from "@tanstack/react-router";
import { lazy } from "react";

export const PageComponentUnit = lazy(
  () => import("@/pages/maintenance/componentUnit/ComponentUnit"),
);

export const PageComponentUnitDetail = lazy(
  () => import("@/pages/maintenance/componentUnit/ComponentUnitDetail"),
);

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
  component: () => <LazyRoute Component={PageComponentUnit} />,
  beforeLoad: () => ({ breadcrumb: "List" }),
});

export const routeComponentUnitDetail = createDetailRoute({
  parent: routeComponentUnit,
  path: "$id",
  Component: () => <LazyRoute Component={PageComponentUnitDetail} />,
});

routeComponentUnit.addChildren([
  routeComponentUnitList,
  routeComponentUnitDetail,
]);
