import { Elysia } from "elysia";
import * as controllers from "./crud/index";

export const crudRoutes = new Elysia({ prefix: "" });

Object.entries(controllers).forEach(([name, ctrl]: any) => {
  if (ctrl && typeof ctrl.use === "function") {
    crudRoutes.use(ctrl);
  } else {
    console.warn("⚠️ Skipped invalid controller: " + name);
  }
});

export default crudRoutes;
