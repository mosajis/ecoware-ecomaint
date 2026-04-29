import RouteUser from "@/pages/access/user/UserRoute";
import RouteUserGroup from "@/pages/access/userGroup/UserGroupRoutes";
import { createRoute, Outlet } from "@tanstack/react-router";
import { protectedRoute } from "../../app/router/routes/protected.routes";

export const AccessRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "access",
  component: () => {
    return <Outlet />;
  },
  beforeLoad: () => ({ breadcrumb: "Access" }),
});

AccessRoute.addChildren([RouteUser, RouteUserGroup]);

export default AccessRoute;
