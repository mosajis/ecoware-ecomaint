import RouteFailureReport from "./failureReport/FailureReportRoutes";

import { createRoute, Outlet } from "@tanstack/react-router";
import { protectedRoute } from "../../app/router/routes/protected.routes";

export const ReportRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "report",
  component: () => <Outlet />,
  beforeLoad: () => ({ breadcrumb: "Report" }),
});

ReportRoute.addChildren([RouteFailureReport]);

export default ReportRoute;
