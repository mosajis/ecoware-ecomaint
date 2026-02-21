import { LazyRoute } from "@/app/router/routes/_components/lazyRoute";
import { generalRoute } from "@/app/router/routes/general.routes";
import { createRoute } from "@tanstack/react-router";
import { lazy } from "react";

const Page = lazy(() => import("./Attachment"));

export default createRoute({
  getParentRoute: () => generalRoute,
  path: "attachment",
  component: () => <LazyRoute Component={Page} />,
  beforeLoad: () => ({ breadcrumb: "Attachment" }),
});
