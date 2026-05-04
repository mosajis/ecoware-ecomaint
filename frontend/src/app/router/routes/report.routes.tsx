import { createRoute, Outlet } from "@tanstack/react-router";
import { LazyRoute } from "./_components/lazyRoute";
import { protectedRoute } from "./protected.routes";
import { lazy } from "react";

export const PagefailureReport = lazy(
  () => import("@/pages/report/failureReport/FailureReport"),
);

// --- General parent route ---
export const ReportRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "report",
  component: () => <Outlet />,
  beforeLoad: () => ({ breadcrumb: "Report" }),
});

// --- General children ---

export const failureReportRoute = createRoute({
  getParentRoute: () => ReportRoute,
  path: "failure",
  component: () => <LazyRoute Component={PagefailureReport} />,
  beforeLoad: () => ({ breadcrumb: "Failure" }),
});
// --- Add all children to parent ---
export const reportRouteTree = ReportRoute.addChildren([failureReportRoute]);
