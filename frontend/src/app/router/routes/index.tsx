import treeGeneral from "@/pages/general/GeneralRoutes";
import treeAccess from "@/pages/access/AccessRoutes";
import treeDashboard from "@/pages/dashboard/DashboardRoute";
import treeSpare from "@/pages/spare/SpareRoutes";
import { createRoute } from "@tanstack/react-router";
import { redirect } from "@tanstack/react-router";
import { protectedRoute } from "./protected.routes";

import { AuthLoginRoute } from "./auth.routes";
import { rootRoute } from "./_components/rootRoute";
import { maintenanceRoutesTree } from "./maintenance.routes";
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
    treeDashboard,
    treeGeneral,
    treeAccess,
    treeSpare,

    reportRouteTree,
    maintenanceRoutesTree,
  ]),
]);
