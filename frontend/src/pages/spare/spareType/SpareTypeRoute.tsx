import { LazyRoute } from "@/app/router/routes/_components/lazyRoute";
import { RouteSpare } from "@/pages/spare/SpareRoutes";
import { generalRoute } from "@/pages/general/GeneralRoutes";
import { createRoute } from "@tanstack/react-router";
import { lazy } from "react";

const Route = createRoute({
  getParentRoute: () => RouteSpare,
  path: "/type",
  component: () => <LazyRoute Component={lazy(() => import("./SpareType"))} />,
  beforeLoad: () => ({ breadcrumb: "Spare Type" }),
});

export default Route;
