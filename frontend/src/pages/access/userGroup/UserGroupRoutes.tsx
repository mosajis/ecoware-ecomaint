import AccessRoute from "@/pages/access/AccessRoutes";
import { LazyRoute } from "@/app/router/routes/_components/lazyRoute";
import { createRoute, Outlet } from "@tanstack/react-router";
import { lazy } from "react";
import { createDetailRoute } from "@/app/router/routes/_components/DetailRoute";

// --- Component Unit ---
export const Route = createRoute({
  getParentRoute: () => AccessRoute,
  path: "user-group",
  component: () => <Outlet />,
  beforeLoad: () => ({ breadcrumb: "User Group" }),
});

export const RouteList = createRoute({
  getParentRoute: () => Route,
  path: "/",
  component: () => <LazyRoute Component={lazy(() => import("./UserGroup"))} />,
  beforeLoad: () => ({ breadcrumb: "List" }),
});

export const RouteDetail = createDetailRoute({
  parent: Route,
  path: "$id",
  Component: () => (
    <LazyRoute Component={lazy(() => import("./UserGroupDetail"))} />
  ),
});

export default Route.addChildren([RouteList, RouteDetail]);
