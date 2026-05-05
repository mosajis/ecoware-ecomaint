import { LazyRoute } from "@/app/router/routes/_components/lazyRoute";
import { RouteSpare } from "@/pages/spare/SpareRoutes";

import { createRoute } from "@tanstack/react-router";
import { lazy } from "react";

const Route = createRoute({
  getParentRoute: () => RouteSpare,
  path: "/unit",
  component: () => <LazyRoute Component={lazy(() => import("./SpareUnit"))} />,
  beforeLoad: () => ({ breadcrumb: "Spare Unit" }),
});

export default Route;
