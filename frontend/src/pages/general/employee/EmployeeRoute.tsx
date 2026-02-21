import { LazyRoute } from "@/app/router/routes/_components/lazyRoute";
import { generalRoute } from "@/app/router/routes/general.routes";
import { createRoute } from "@tanstack/react-router";
import { lazy } from "react";

const Page = lazy(() => import("./Employee"));

export default createRoute({
  getParentRoute: () => generalRoute,
  path: "employee",
  component: () => <LazyRoute Component={Page} />,
  beforeLoad: () => ({ breadcrumb: "Employee" }),
});
