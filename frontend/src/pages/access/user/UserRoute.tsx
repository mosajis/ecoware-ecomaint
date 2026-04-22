import { LazyRoute } from "@/app/router/routes/_components/lazyRoute";
import AccessRoute from "@/app/router/routes/access.routes";
import { createRoute } from "@tanstack/react-router";
import { lazy } from "react";

export default createRoute({
  getParentRoute: () => AccessRoute,
  path: "users",
  component: () => <LazyRoute Component={lazy(() => import("./User"))} />,
  beforeLoad: () => ({ breadcrumb: "Users" }),
});
