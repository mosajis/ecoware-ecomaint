import { LazyRoute } from "@/app/router/routes/_components/lazyRoute";
import { generalRoute } from "@/pages/general/GeneralRoutes";
import { createRoute } from "@tanstack/react-router";
import { lazy } from "react";

const Route = createRoute({
  getParentRoute: () => generalRoute,
  path: "attachment",
  component: () => <LazyRoute Component={lazy(() => import("./Attachment"))} />,
  beforeLoad: () => ({ breadcrumb: "Attachment" }),
});

export default Route;
