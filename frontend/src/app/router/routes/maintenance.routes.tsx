import RouteMeasurePointLog from "@/pages/maintenance/measurePointLog/MeasurePointLogRoute";
import RouteCounterLog from "@/pages/maintenance/counterLog/CounterLogRoute";
import RouteMeasurePoint from "@/pages/maintenance/measurePoint/MeasurePointRoute";
import routeComponentUnit from "@/pages/maintenance/componentUnit/ComponentUnitRoutes";
import routeFunction from "@/pages/maintenance/function/FunctionRoutes";
import routeMaintLog from "@/pages/maintenance/maintLog/MaintLogRoute";
import routeWorkShop from "@/pages/maintenance/workShop/WorkShopRoutes";
import routeCountersAlert from "@/pages/maintenance/counterAlert/CounterAlertRoutes";
import { lazy } from "react";
import { createRoute, Outlet } from "@tanstack/react-router";
import { protectedRoute } from "./protected.routes";
import { LazyRoute } from "./_components/lazyRoute";
import { routeComponentType } from "@/pages/maintenance/componentType/ComponentTypeRoutes";
import { NotFound } from "@/pages/NotFound";

//  Lazy pages ---
const PageComponentJob = lazy(
  () => import("@/pages/maintenance/componentJob/ComponentJob"),
);
const PageWorkOrder = lazy(
  () => import("@/pages/maintenance/workOrder/WorkOrder"),
);
const PageRound = lazy(() => import("@/pages/maintenance/round/Round"));

const PageCounterUpdate = lazy(
  () => import("@/pages/maintenance/counter/Counter"),
);

// --- Maintenance root ---
export const routeMaintenance = createRoute({
  notFoundComponent: () => <NotFound />,
  getParentRoute: () => protectedRoute,
  path: "maintenance",
  component: () => <Outlet />,
  beforeLoad: () => ({ breadcrumb: "Maintenance" }),
});

// --- Work Order ---
export const routeWorkOrder = createRoute({
  getParentRoute: () => routeMaintenance,
  path: "work-order",
  component: () => <LazyRoute Component={PageWorkOrder} />,
  beforeLoad: () => ({ breadcrumb: "Work Order" }),
});

// --- Round ---
export const routeRound = createRoute({
  getParentRoute: () => routeMaintenance,
  path: "round",
  component: () => <LazyRoute Component={PageRound} />,
  beforeLoad: () => ({ breadcrumb: "Round" }),
});

// --- Counter Update ---
export const routeCounterUpdate = createRoute({
  getParentRoute: () => routeMaintenance,
  path: "counters",
  component: () => <LazyRoute Component={PageCounterUpdate} />,
  beforeLoad: () => ({ breadcrumb: "Counters" }),
});

export const routeComponentJob = createRoute({
  getParentRoute: () => routeMaintenance,
  path: "component-job",
  component: () => <LazyRoute Component={PageComponentJob} />,
  beforeLoad: () => ({ breadcrumb: "Component Job" }),
});
// --- Maintenance root ---
export const maintenanceRoutesTree = routeMaintenance.addChildren([
  routeFunction,
  routeComponentUnit,
  routeComponentType,
  routeComponentJob,
  routeWorkOrder,
  routeRound,
  RouteMeasurePointLog,
  RouteMeasurePoint,
  RouteCounterLog,
  routeCounterUpdate,
  routeMaintLog,
  routeCountersAlert,
  routeWorkShop,
]);
