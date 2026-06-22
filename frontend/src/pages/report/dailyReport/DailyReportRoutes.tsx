import { LazyRoute } from "@/app/router/routes/_components/lazyRoute";
import ReportRoute from "../ReportRoutes";
import { createRoute, Outlet } from "@tanstack/react-router";
import { lazy } from "react";

const Route = createRoute({
  getParentRoute: () => ReportRoute,
  path: "daily",
  component: () => (
    <LazyRoute Component={lazy(() => import("./DailyReport"))} />
  ),
  beforeLoad: () => ({ breadcrumb: "Daily" }),
});

export default Route;
