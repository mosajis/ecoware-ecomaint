import { LazyRoute } from "@/app/router/routes/_components/lazyRoute";
import { generalRoute } from "@/pages/general/GeneralRoutes";
import { createRoute } from "@tanstack/react-router";
import { lazy } from "react";

const Page = lazy(() => import("./JobDescription"));

export default createRoute({
  getParentRoute: () => generalRoute,
  path: "job-description",
  component: () => <LazyRoute Component={Page} />,
  beforeLoad: () => ({ breadcrumb: "Job Description" }),
});
