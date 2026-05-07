import { LazyRoute } from "@/app/router/routes/_components/lazyRoute";
import { routeMaintenance } from "@/pages/maintenance/MaintenanceRoutes";
import { createRoute } from "@tanstack/react-router";
import { lazy } from "react";

// --- Counters & Maint Logs ---
export const Route = createRoute({
  getParentRoute: () => routeMaintenance,
  path: "counter-log",
  component: () => <LazyRoute Component={lazy(() => import("./CounterLog"))} />,
  beforeLoad: () => ({ breadcrumb: "Counter Log" }),
});

export default Route;
