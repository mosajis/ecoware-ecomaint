import { LazyRoute } from "@/app/router/routes/_components/lazyRoute";
import { RouteSpare } from "@/pages/spare/SpareRoutes";
import { generalRoute } from "@/pages/general/GeneralRoutes";
import { createRoute } from "@tanstack/react-router";
import { lazy } from "react";

const Route = createRoute({
  getParentRoute: () => RouteSpare,
  path: "/used",
  component: () => <LazyRoute Component={lazy(() => import("./SpareUsed"))} />,
  beforeLoad: () => ({ breadcrumb: "Spare Used" }),
});

export default Route;
