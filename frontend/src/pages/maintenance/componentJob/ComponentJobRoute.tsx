import { LazyRoute } from "@/app/router/routes/_components/lazyRoute";
import { routeMaintenance } from "@/pages/maintenance/MaintenanceRoutes";
import { createRoute } from "@tanstack/react-router";
import { lazy } from "react";

const countersAlert = createRoute({
  getParentRoute: () => routeMaintenance,
  path: "component-job",
  component: () => (
    <LazyRoute Component={lazy(() => import("./ComponentJob"))} />
  ),
  beforeLoad: () => ({ breadcrumb: "Component Job" }),
});

const routes = countersAlert;

export default routes;
