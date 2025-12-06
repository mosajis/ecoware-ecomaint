import Elysia from "elysia";
import crudRoutes from "./crud";
import { ControllerAuth } from "./auth/auth.controller";
export const allRoutes = new Elysia({ prefix: "" })
    .use(crudRoutes)
    .use(ControllerAuth);
