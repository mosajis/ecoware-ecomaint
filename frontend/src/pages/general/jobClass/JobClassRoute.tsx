import { LazyRoute } from "@/app/router/routes/_components/lazyRoute";
import { generalRoute } from "@/pages/general/GeneralRoutes";
import { createRoute } from "@tanstack/react-router";
import { lazy } from "react";

export const Page = lazy(() => import("./JobClass"));

export default createRoute({
  getParentRoute: () => generalRoute,
  path: "job-class",
  component: () => <LazyRoute Component={Page} />,
  beforeLoad: () => ({ breadcrumb: "Job Class" }),
});
