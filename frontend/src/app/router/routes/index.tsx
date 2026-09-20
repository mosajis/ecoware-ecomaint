import treeAccess from "@/pages/access/AccessRoutes";
import treeDashboard, { RouteLocal } from "@/pages/dashboard/DashboardRoute";
import treeGeneral from "@/pages/general/GeneralRoutes";

import treeReport from "@/pages/report/ReportRoutes";
import treeSpare from "@/pages/spare/SpareRoutes";
import { createRoute, redirect } from "@tanstack/react-router";
import { protectedRoute } from "./protected.routes";

import { maintenanceRoutesTree } from "../../../pages/maintenance/MaintenanceRoutes";
import { rootRoute } from "./_components/rootRoute";
import { AuthLoginRoute } from "./auth.routes";

// --- Index redirect "/" → "/dashboard" ---
export const indexRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/",
  beforeLoad: async () => {
    throw redirect({ to: RouteLocal.to });
  },
});

// --- Route Tree ---
export const routesTree = rootRoute.addChildren([
  AuthLoginRoute,
  protectedRoute.addChildren([
    indexRoute,

    treeDashboard,

    treeGeneral,
    treeAccess,
    treeSpare,
    treeReport,

    maintenanceRoutesTree,
  ]),
]);
