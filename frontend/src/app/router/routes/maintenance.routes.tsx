import RouteMeasurePointLog from "@/pages/maintenance/measurePointLog/MeasurePointLogRoute";
import RouteCounterLog from "@/pages/maintenance/counterLog/CounterLogRoute";
import RouteCounterUpdate from "@/pages/maintenance/counter/CounterRoute";
import RouteMeasurePoint from "@/pages/maintenance/measurePoint/MeasurePointRoute";
import RouteComponentUnit from "@/pages/maintenance/componentUnit/ComponentUnitRoutes";
import RouteFunction from "@/pages/maintenance/function/FunctionRoutes";
import RouteMaintLog from "@/pages/maintenance/maintLog/MaintLogRoute";
import RouteWorkShop from "@/pages/maintenance/workShop/WorkShopRoutes";
import RouteCounterAlert from "@/pages/maintenance/counterAlert/CounterAlertRoutes";
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

export const routeComponentJob = createRoute({
  getParentRoute: () => routeMaintenance,
  path: "component-job",
  component: () => <LazyRoute Component={PageComponentJob} />,
  beforeLoad: () => ({ breadcrumb: "Component Job" }),
});
// --- Maintenance root ---
export const maintenanceRoutesTree = routeMaintenance.addChildren([
  RouteFunction,
  RouteComponentUnit,
  RouteMeasurePointLog,
  RouteMeasurePoint,
  RouteCounterLog,
  RouteCounterUpdate,
  RouteCounterAlert,
  RouteMaintLog,
  RouteWorkShop,

  routeComponentType,
  routeComponentJob,
  routeWorkOrder,
  routeRound,
]);
