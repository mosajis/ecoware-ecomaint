import { LazyRoute } from "@/app/router/routes/_components/lazyRoute";
import { routeMaintenance } from "@/app/router/routes/maintenance.routes";
import { createRoute } from "@tanstack/react-router";
import { lazy } from "react";

// --- Measure Points ---
export const Route = createRoute({
  getParentRoute: () => routeMaintenance,
  path: "measure-point",
  component: () => (
    <LazyRoute Component={lazy(() => import("./MeasurePoint"))} />
  ),
  beforeLoad: () => ({ breadcrumb: "Measure Point" }),
});

export default Route;
