import RouteMeasurePointLog from "@/pages/maintenance/measurePointLog/MeasurePointLogRoute";
import RouteCounterLog from "@/pages/maintenance/counterLog/CounterLogRoute";
import RouteCounterUpdate from "@/pages/maintenance/counter/CounterRoute";
import RouteMeasurePoint from "@/pages/maintenance/measurePoint/MeasurePointRoute";
import RouteComponentUnit from "@/pages/maintenance/componentUnit/ComponentUnitRoutes";
import RouteFunction from "@/pages/maintenance/function/FunctionRoutes";
import RouteMaintLog from "@/pages/maintenance/maintLog/MaintLogRoute";
import RouteWorkShop from "@/pages/maintenance/workShop/WorkShopRoutes";
import RouteCounterAlert from "@/pages/maintenance/counterAlert/CounterAlertRoutes";
import RouteComponentType from "@/pages/maintenance/componentType/ComponentTypeRoutes";
import RouteComponentJob from "@/pages/maintenance/componentJob/ComponentJobRoute";

import { lazy } from "react";
import { createRoute, Outlet } from "@tanstack/react-router";
import { protectedRoute } from "../../app/router/routes/protected.routes";
import { LazyRoute } from "../../app/router/routes/_components/lazyRoute";
import { NotFound } from "@/pages/NotFound";

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
  RouteComponentType,
  RouteComponentJob,
  routeWorkOrder,
  routeRound,
]);
