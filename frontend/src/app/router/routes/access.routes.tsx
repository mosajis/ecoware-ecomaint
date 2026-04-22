import RouteUser from "@/pages/access/user/UserRoute";
import { createRoute, Outlet } from "@tanstack/react-router";
import { protectedRoute } from "./protected.routes";

export const AccessRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "access",
  component: () => {
    return <Outlet />;
  },
  beforeLoad: () => ({ breadcrumb: "Access" }),
});

AccessRoute.addChildren([RouteUser]);

export default AccessRoute;
