import AccessRoute from "@/pages/access/access.routes";
import { LazyRoute } from "@/app/router/routes/_components/lazyRoute";
import { createRoute, Outlet } from "@tanstack/react-router";
import { lazy } from "react";
import { createDetailRoute } from "@/app/router/routes/_components/DetailRoute";

// --- Component Unit ---
export const routeUserGroup = createRoute({
  getParentRoute: () => AccessRoute,
  path: "user-group",
  component: () => <Outlet />,
  beforeLoad: () => ({ breadcrumb: "User Group" }),
});

export const routeUserGroupList = createRoute({
  getParentRoute: () => routeUserGroup,
  path: "/",
  component: () => <LazyRoute Component={lazy(() => import("./UserGroup"))} />,
  beforeLoad: () => ({ breadcrumb: "List" }),
});

export const routeUserGroupDetail = createDetailRoute({
  parent: routeUserGroup,
  path: "$id",
  Component: () => (
    <LazyRoute Component={lazy(() => import("./UserGroupDetail"))} />
  ),
});

export default routeUserGroup.addChildren([
  routeUserGroupList,
  routeUserGroupDetail,
]);
