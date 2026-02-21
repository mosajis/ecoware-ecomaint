import { LazyRoute } from "@/app/router/routes/_components/lazyRoute";
import { generalRoute } from "@/app/router/routes/general.routes";
import { createRoute } from "@tanstack/react-router";
import { lazy } from "react";

const Page = lazy(() => import("@/pages/general/address/Address"));

export default createRoute({
  getParentRoute: () => generalRoute,
  path: "address",
  component: () => <LazyRoute Component={Page} />,
  beforeLoad: () => ({ breadcrumb: "Address" }),
});
