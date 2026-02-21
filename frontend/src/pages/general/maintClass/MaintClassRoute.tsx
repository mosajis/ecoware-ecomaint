import { LazyRoute } from "@/app/router/routes/_components/lazyRoute";
import { generalRoute } from "@/app/router/routes/general.routes";
import { createRoute } from "@tanstack/react-router";
import { lazy } from "react";

export const Page = lazy(() => import("./MaintClass"));

export default createRoute({
  getParentRoute: () => generalRoute,
  path: "maint-class",
  component: () => <LazyRoute Component={Page} />,
  beforeLoad: () => ({ breadcrumb: "Maint Class" }),
});
