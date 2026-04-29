import AccessRoute from "@/pages/access/access.routes";
import { LazyRoute } from "@/app/router/routes/_components/lazyRoute";
import { createRoute } from "@tanstack/react-router";
import { lazy } from "react";

export default createRoute({
  getParentRoute: () => AccessRoute,
  path: "user",
  component: () => <LazyRoute Component={lazy(() => import("./User"))} />,
  beforeLoad: () => ({ breadcrumb: "Users" }),
});
