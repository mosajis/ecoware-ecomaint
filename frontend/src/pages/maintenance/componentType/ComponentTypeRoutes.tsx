import { createDetailRoute } from "@/app/router/routes/_components/DetailRoute";
import { LazyRoute } from "@/app/router/routes/_components/lazyRoute";
import { routeMaintenance } from "@/app/router/routes/maintenance.routes";
import { createRoute, Outlet } from "@tanstack/react-router";
import { lazy } from "react";

export const PageComponentType = lazy(
  () => import("@/pages/maintenance/componentType/ComponentType"),
);
export const PageComponentTypeDetail = lazy(
  () => import("@/pages/maintenance/componentType/ComponentTypeDetail"),
);

export const routeComponentType = createRoute({
  getParentRoute: () => routeMaintenance,
  path: "component-type",
  component: Outlet,
  beforeLoad: () => ({
    breadcrumb: "Component Type",
  }),
});

export const routeComponentTypeList = createRoute({
  getParentRoute: () => routeComponentType,
  path: "/",
  component: () => <LazyRoute Component={PageComponentType} />,
  beforeLoad: () => ({
    breadcrumb: "List",
  }),
});

export const routeComponentTypeDetail = createDetailRoute({
  parent: routeComponentType,
  path: "/$id",
  Component: () => <LazyRoute Component={PageComponentTypeDetail} />,
});

routeComponentType.addChildren([
  routeComponentTypeList,
  routeComponentTypeDetail,
]);
