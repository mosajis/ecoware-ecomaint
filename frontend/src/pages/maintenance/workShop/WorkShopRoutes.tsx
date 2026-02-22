import { LazyRoute } from "@/app/router/routes/_components/lazyRoute";
import { routeMaintenance } from "@/app/router/routes/maintenance.routes";
import { createRoute } from "@tanstack/react-router";
import { lazy } from "react";

const Page = lazy(() => import("@/pages/maintenance/workShop/WorkShop"));

const Route = createRoute({
  getParentRoute: () => routeMaintenance,
  path: "workshop",
  component: () => <LazyRoute Component={Page} />,
  beforeLoad: () => ({ breadcrumb: "WorkShop" }),
});

export default Route;
