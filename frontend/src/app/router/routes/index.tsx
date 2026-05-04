import treeGeneral from "../../../pages/general/GeneralRoutes";
import treeAccess from "../../../pages/access/access.routes";
import { createRoute } from "@tanstack/react-router";
import { redirect } from "@tanstack/react-router";
import { protectedRoute } from "./protected.routes";
import { routes as stockRouteTree } from "./spare.routes";
import { AuthLoginRoute } from "./auth.routes";
import { rootRoute } from "./_components/rootRoute";
import { maintenanceRoutesTree } from "./maintenance.routes";
import { dashboardRoutesTree } from "./dashboard.routes";
import { reportRouteTree } from "./report.routes";

// --- Index redirect "/" → "/dashboard" ---
export const indexRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/",
  beforeLoad: async () => {
    throw redirect({ to: "/dashboard" });
  },
});

// --- Route Tree ---
export const routesTree = rootRoute.addChildren([
  indexRoute,
  AuthLoginRoute,
  protectedRoute.addChildren([
    treeGeneral,
    treeAccess,
    reportRouteTree,
    stockRouteTree,
    dashboardRoutesTree,
    maintenanceRoutesTree,
  ]),
]);
