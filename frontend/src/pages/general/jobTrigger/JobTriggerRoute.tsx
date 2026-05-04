import { LazyRoute } from "@/app/router/routes/_components/lazyRoute";
import { generalRoute } from "@/pages/general/GeneralRoutes";
import { createRoute } from "@tanstack/react-router";
import { lazy } from "react";

const Page = lazy(() => import("./JobTrigger"));

export default createRoute({
  getParentRoute: () => generalRoute,
  path: "job-trigger",
  component: () => <LazyRoute Component={Page} />,
  beforeLoad: () => ({ breadcrumb: "Job Trigger" }),
});
