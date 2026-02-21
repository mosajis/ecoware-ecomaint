import { LazyRoute } from "@/app/router/routes/_components/lazyRoute";
import { generalRoute } from "@/app/router/routes/general.routes";
import { createRoute } from "@tanstack/react-router";
import { lazy } from "react";

export const Page = lazy(() => import("./Location"));

export default createRoute({
  getParentRoute: () => generalRoute,
  path: "location",
  component: () => <LazyRoute Component={Page} />,
  beforeLoad: () => ({ breadcrumb: "Location" }),
});
