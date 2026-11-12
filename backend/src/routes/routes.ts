import Elysia from "elysia";
import crudRoutes from "./crud";
import { ControllerAuth } from "./auth/auth.controller";
import { ControllerStatistics } from "./statistics/statistics.controller";
import { ControllerKPI } from "./statistics/kpi.controller";
import { ControllerWaiting } from "./statistics/waiting.controller";

export const allRoutes = new Elysia({ prefix: "" })
  .use(crudRoutes)
  .use(ControllerAuth)
  .use(ControllerStatistics)
  .use(ControllerKPI)
  .use(ControllerWaiting);
