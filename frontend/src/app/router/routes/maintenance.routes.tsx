import { lazy } from "react";
import { createRoute, Outlet } from "@tanstack/react-router";
import { protectedRoute } from "./protected.routes";
import { LazyRoute } from "./_components/lazyRoute";
import { routeComponentType } from "@/pages/maintenance/componentType/ComponentTypeRoutes";
import { NotFound } from "@/pages/NotFound";
import routeComponentUnit from "@/pages/maintenance/componentUnit/ComponentUnitRoutes";
import routeFunction from "@/pages/maintenance/function/FunctionRoutes";

//  Lazy pages ---

const PageComponentJob = lazy(
  () => import("@/pages/maintenance/componentJob/ComponentJob"),
);
const PageWorkOrder = lazy(
  () => import("@/pages/maintenance/workOrder/WorkOrder"),
);
const PageRound = lazy(() => import("@/pages/maintenance/round/Round"));
const PageMeasurePoints = lazy(
  () => import("@/pages/maintenance/measurePoints/MeasurePoints"),
);
const PageMeasurePointsLogs = lazy(
  () => import("@/pages/maintenance/measurePointsLogs/MeasurePointsLogs"),
);
const PageCountersLog = lazy(
  () => import("@/pages/maintenance/countersLogs/CountersLogs"),
);
const PageMaintLog = lazy(
  () => import("@/pages/maintenance/maintLog/MaintLog"),
);
const PageCounterUpdate = lazy(
  () => import("@/pages/maintenance/counters/Counters"),
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

// --- Measure Points ---
export const routeMeasurePoints = createRoute({
  getParentRoute: () => routeMaintenance,
  path: "measure-points",
  component: () => <LazyRoute Component={PageMeasurePoints} />,
  beforeLoad: () => ({ breadcrumb: "Measure Points" }),
});
export const routeMeasurePointsLogs = createRoute({
  getParentRoute: () => routeMaintenance,
  path: "measure-points-logs",
  component: () => <LazyRoute Component={PageMeasurePointsLogs} />,
  beforeLoad: () => ({ breadcrumb: "Measure Points Logs" }),
});

// --- Counters & Maint Logs ---
export const routeCountersLog = createRoute({
  getParentRoute: () => routeMaintenance,
  path: "counters-logs",
  component: () => <LazyRoute Component={PageCountersLog} />,
  beforeLoad: () => ({ breadcrumb: "Counters Logs" }),
});
export const routeMaintLog = createRoute({
  getParentRoute: () => routeMaintenance,
  path: "maint-log",
  component: () => <LazyRoute Component={PageMaintLog} />,
  beforeLoad: () => ({ breadcrumb: "Maint Logs" }),
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
  routeMeasurePoints,
  routeMeasurePointsLogs,
  routeCountersLog,
  routeCounterUpdate,
  routeMaintLog,
]);
