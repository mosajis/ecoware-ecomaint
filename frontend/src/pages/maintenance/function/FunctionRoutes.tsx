import { createDetailRoute } from "@/app/router/routes/_components/DetailRoute";
import { LazyRoute } from "@/app/router/routes/_components/lazyRoute";
import { routeMaintenance } from "@/app/router/routes/maintenance.routes";
import { createRoute, Outlet } from "@tanstack/react-router";
import { lazy } from "react";

// --- Component Unit ---
const routeFunction = createRoute({
  getParentRoute: () => routeMaintenance,
  path: "/function",
  component: () => <Outlet />,
  beforeLoad: () => ({ breadcrumb: "Functions" }),
});

const routeList = createRoute({
  getParentRoute: () => routeFunction,
  path: "/",
  component: () => (
    <LazyRoute
      Component={lazy(() => import("@/pages/maintenance/function/Function"))}
    />
  ),
  beforeLoad: () => ({ breadcrumb: "List" }),
});

export const routeDetail = createDetailRoute({
  parent: routeFunction,
  path: "$id",
  Component: () => (
    <LazyRoute
      Component={lazy(
        () => import("@/pages/maintenance/function/FunctionDetail"),
      )}
    />
  ),
});

routeFunction.addChildren([routeList, routeDetail]);

export default routeFunction;
