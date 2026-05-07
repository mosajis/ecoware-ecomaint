import { LazyRoute } from "@/app/router/routes/_components/lazyRoute";
import { routeMaintenance } from "@/pages/maintenance/MaintenanceRoutes";
import { createRoute } from "@tanstack/react-router";
import { lazy } from "react";

const countersAlert = createRoute({
  getParentRoute: () => routeMaintenance,
  path: "counter-alert",
  component: () => (
    <LazyRoute Component={lazy(() => import("./CounterAlert"))} />
  ),
  beforeLoad: () => ({ breadcrumb: "Counter Alert" }),
});

const routes = countersAlert;

export default routes;
