import { LazyRoute } from "@/app/router/routes/_components/lazyRoute";
import { routeMaintenance } from "@/app/router/routes/maintenance.routes";
import { createRoute } from "@tanstack/react-router";
import { lazy } from "react";
import z from "zod";

const searchSchema = z.object({
  filter: z.string().optional(),
});

const maintLog = createRoute({
  getParentRoute: () => routeMaintenance,
  path: "maint-log",
  validateSearch: searchSchema,
  component: () => (
    <LazyRoute
      Component={lazy(() => import("@/pages/maintenance/maintLog/MaintLog"))}
    />
  ),
  beforeLoad: () => ({ breadcrumb: "Maint Logs" }),
});

const routes = maintLog;

export default routes;
