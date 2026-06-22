import RouteFailureReport from "./failureReport/FailureReportRoutes";
import RouteDailyReport from "./dailyReport/DailyReportRoutes";

import { createRoute, Outlet } from "@tanstack/react-router";
import { protectedRoute } from "../../app/router/routes/protected.routes";

export const RouteReport = createRoute({
  getParentRoute: () => protectedRoute,
  path: "report",
  component: () => <Outlet />,
  beforeLoad: () => ({ breadcrumb: "Report" }),
});

RouteReport.addChildren([RouteFailureReport, RouteDailyReport]);

export default RouteReport;
