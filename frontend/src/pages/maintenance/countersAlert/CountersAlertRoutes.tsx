import { LazyRoute } from "@/app/router/routes/_components/lazyRoute";
import { routeMaintenance } from "@/app/router/routes/maintenance.routes";
import { createRoute } from "@tanstack/react-router";
import { lazy } from "react";

const countersAlert = createRoute({
  getParentRoute: () => routeMaintenance,
  path: "counters-alert",
  component: () => (
    <LazyRoute
      Component={lazy(
        () => import("@/pages/maintenance/countersAlert/CountersAlert"),
      )}
    />
  ),
  beforeLoad: () => ({ breadcrumb: "Counters Alert" }),
});

const routes = countersAlert;

export default routes;
