import { LazyRoute } from "@/app/router/routes/_components/lazyRoute";
import { generalRoute } from "@/pages/general/GeneralRoutes";
import { createRoute } from "@tanstack/react-router";
import { lazy } from "react";

export const Page = lazy(() => import("./PendingType"));

export default createRoute({
  getParentRoute: () => generalRoute,
  path: "pending-type",
  component: () => <LazyRoute Component={Page} />,
  beforeLoad: () => ({ breadcrumb: "Pending Type" }),
});
