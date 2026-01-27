import { createRoute, Outlet } from "@tanstack/react-router";
import { LazyRoute } from "./_components/lazyRoute";
import { protectedRoute } from "./protected.routes";
import { lazy } from "react";

const Route = createRoute({
  getParentRoute: () => protectedRoute,
  path: "spare",
  component: () => <Outlet />,
  beforeLoad: () => ({ breadcrumb: "Spare" }),
});

const StockItem = createRoute({
  getParentRoute: () => Route,
  path: "/unit",
  component: () => (
    <LazyRoute
      Component={lazy(() => import("@/pages/spare/spareUnit/SpareUnit"))}
    />
  ),
  beforeLoad: () => ({ breadcrumb: "Spare unit" }),
});

const StockType = createRoute({
  getParentRoute: () => Route,
  path: "/type",
  component: () => (
    <LazyRoute
      Component={lazy(() => import("@/pages/spare/spareType/SpareType"))}
    />
  ),
  beforeLoad: () => ({ breadcrumb: "Spare Type" }),
});

const StockUsed = createRoute({
  getParentRoute: () => Route,
  path: "/used",
  component: () => (
    <LazyRoute
      Component={lazy(() => import("@/pages/spare/spareUsed/SpareUsed"))}
    />
  ),
  beforeLoad: () => ({ breadcrumb: "Spare Used" }),
});

export const routes = Route.addChildren([StockItem, StockType, StockUsed]);
