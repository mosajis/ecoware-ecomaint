import { LazyRoute } from "@/app/router/routes/_components/lazyRoute";
import { routeMaintenance } from "@/app/router/routes/maintenance.routes";
import { createRoute } from "@tanstack/react-router";
import { lazy } from "react";

const Route = createRoute({
  getParentRoute: () => routeMaintenance,
  path: "measure-point-log",
  component: () => (
    <LazyRoute Component={lazy(() => import("./MeasurePointLog"))} />
  ),
  beforeLoad: () => ({ breadcrumb: "Measure Point Log" }),
});

export default Route;
