import { LazyRoute } from "@/app/router/routes/_components/lazyRoute";
import { routeMaintenance } from "@/app/router/routes/maintenance.routes";
import { createRoute } from "@tanstack/react-router";
import { lazy } from "react";

const Route = createRoute({
  getParentRoute: () => routeMaintenance,
  path: "counter",
  component: () => <LazyRoute Component={lazy(() => import("./Counter"))} />,
  beforeLoad: () => ({ breadcrumb: "Counter" }),
});

export default Route;
