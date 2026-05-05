import RouteSpareType from "./spareType/SpareTypeRoute";
import RouteSpareUnit from "./spareUnit/SpareUnitRoute";
import RouteSpareUsed from "./spareUsed/SpareUsedRoute";

import { createRoute, Outlet } from "@tanstack/react-router";
import { protectedRoute } from "../../app/router/routes/protected.routes";

export const RouteSpare = createRoute({
  getParentRoute: () => protectedRoute,
  path: "spare",
  component: () => <Outlet />,
  beforeLoad: () => ({ breadcrumb: "Spare" }),
});

RouteSpare.addChildren([RouteSpareType, RouteSpareUnit, RouteSpareUsed]);

export default RouteSpare;
