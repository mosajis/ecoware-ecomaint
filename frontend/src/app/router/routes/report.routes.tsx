import { createRoute, Outlet } from "@tanstack/react-router";
import { LazyRoute } from "./_components/lazyRoute";
import { protectedRoute } from "./protected.routes";
import { lazy } from "react";

// --- Lazy pages ---
export const PageReportDaily = lazy(
  () => import("@/pages/report/dailyReport/ReportDaily"),
);

export const PageReportFailure = lazy(
  () => import("@/pages/report/failureReport/FailureReport"),
);

export const PageReportJob = lazy(
  () => import("@/pages/report/jobReport/ReportJob"),
);

export const PageReportMounthly = lazy(
  () => import("@/pages/report/mounthlyReport/ReportMounthly"),
);

// --- General parent route ---
export const ReportRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "report",
  component: () => <Outlet />,
  beforeLoad: () => ({ breadcrumb: "Report" }),
});

// --- General children ---
export const ReportDailyRoute = createRoute({
  getParentRoute: () => ReportRoute,
  path: "daily",
  component: () => <LazyRoute Component={PageReportDaily} />,
  beforeLoad: () => ({ breadcrumb: "Daily" }),
});

export const ReportJobRoute = createRoute({
  getParentRoute: () => ReportRoute,
  path: "job",
  component: () => <LazyRoute Component={PageReportJob} />,
  beforeLoad: () => ({ breadcrumb: "Job" }),
});

export const ReportMounthlyRoute = createRoute({
  getParentRoute: () => ReportRoute,
  path: "monthly",
  component: () => <LazyRoute Component={PageReportMounthly} />,
  beforeLoad: () => ({ breadcrumb: "Monthly" }),
});

export const ReportFailureRoute = createRoute({
  getParentRoute: () => ReportRoute,
  path: "failure",
  component: () => <LazyRoute Component={PageReportFailure} />,
  beforeLoad: () => ({ breadcrumb: "Failure" }),
});
// --- Add all children to parent ---
export const reportRouteTree = ReportRoute.addChildren([
  ReportMounthlyRoute,
  ReportJobRoute,
  ReportDailyRoute,
  ReportFailureRoute,
]);
