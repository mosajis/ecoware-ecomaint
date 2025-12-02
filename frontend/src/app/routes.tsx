import { Outlet, redirect } from "@tanstack/react-router";
import { createRoute, createRootRoute } from "@tanstack/react-router";
import AppLayout from "@/shared/components/layout/AppLayout";
import { LOCAL_STORAGE } from "@/const";
import AppAuthorization from "@/shared/components/AppAthorization";

import PageLogin from "@/pages/auth/login/login.page";
import PageAddress from "@/pages/general/address/Address";
import PageLocation from "@/pages/general/location/Location";
import PageEmployee from "@/pages/general/employee/Employee";
import PageDiscipline from "@/pages/general/discipline/Discipline";
import PageCounterType from "@/pages/general/counterType/CounterType";
import PageMaintClass from "@/pages/general/maintClass/MaintClass";

// --- Root ---
export const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// --- Pathless Protected Route ---
export const protectedRoute = createRoute({
  id: "protected",
  getParentRoute: () => rootRoute,
  component: () => (
    <AppAuthorization>
      <AppLayout />
    </AppAuthorization>
  ),
  beforeLoad: async ({ location }) => {
    const token = localStorage.getItem(LOCAL_STORAGE.ACCESS_KEY);
    if (!token) {
      throw redirect({
        to: "/auth/login",
        search: { redirect: location.href },
      });
    }
  },
});

// --- Redirect "/" → "/dashboard" ---
export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: async () => {
    throw redirect({ to: "/dashboard" });
  },
});

// --- Auth Login ---
export const AuthLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth/login",
  component: PageLogin,
});

// --- Protected Routes ---
// Dashboard
export const dashboardRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/dashboard",
  component: () => "Dashboard Page",
});

// --- General ---
export const generalAddressRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/general/address",
  component: PageAddress,
});
export const generalLocationRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/general/location",
  component: PageLocation,
});
export const generalEmployeeRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/general/employee",
  component: PageEmployee,
});
export const generalDisciplineRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/general/discipline",
  component: PageDiscipline,
});
export const generalCounterTypeRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/general/counter-type",
  component: PageCounterType,
});
export const generalMaintClassRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/general/maint-class",
  component: PageMaintClass,
});
export const generalFollowStatusRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/general/follow-status",
  component: () => "Follow Status Page",
});
export const generalPendingTypeRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/general/pending-type",
  component: () => "Pending Type Page",
});
export const generalJobClassRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/general/job-class",
  component: () => "Job Class Page",
});
export const generalJobDescriptionRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/general/job-description",
  component: () => "Job Description Page",
});

// --- Maintenance ---
export const maintFunctionRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/maintenance/function",
  component: () => "Function Page",
});
export const maintComponentUnitRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/maintenance/component-unit",
  component: () => "Component Unit Page",
});
export const maintComponentTypeRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/maintenance/component-type",
  component: () => "Component Type Page",
});
export const maintComponentTypeTreeRoute = createRoute({
  getParentRoute: () => maintComponentTypeRoute,
  path: "tree-view",
  component: () => "Component Type - Tree View Page",
});
export const maintComponentTypeListRoute = createRoute({
  getParentRoute: () => maintComponentTypeRoute,
  path: "list-view",
  component: () => "Component Type - List View Page",
});
export const maintComponentJobRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/maintenance/component-job",
  component: () => "Component Job Page",
});
export const maintWorkOrderRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/maintenance/work-order",
  component: () => "Work Order Page",
});
export const maintRoundRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/maintenance/round",
  component: () => "Round Page",
});
export const maintUnplannedJobsRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/maintenance/unplanned-jobs",
  component: () => "Unplanned Jobs Page",
});
export const maintRequisitionWorkRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/maintenance/requisition-work",
  component: () => "Requisition Work Page",
});
export const maintComponentTriggerRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/maintenance/component-trigger",
  component: () => "Component Trigger Page",
});
export const maintUpdateCounterRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/maintenance/update-counter",
  component: () => "Update Counter Page",
});
export const maintCounterLogRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/maintenance/counter-log",
  component: () => "Counter Log Page",
});
export const maintMeasurePointsRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/maintenance/measure-points",
  component: () => "Measure Points Page",
});
export const maintMeasurePointsLogsRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/maintenance/measure-points-logs",
  component: () => "Measure Points Logs Page",
});
export const maintMaintLogRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/maintenance/maint-log",
  component: () => "Maint Log Page",
});

// --- Stock ---
export const stockTypeRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/stock/stock-type",
  component: () => "Stock Type Page",
});
export const stockItemRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/stock/stock-item",
  component: () => "Stock Item Page",
});
export const stockUsedRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/stock/stock-used",
  component: () => "Stock Used Page",
});

// --- Users ---
export const usersRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/users",
  component: () => "Users Page",
});

// --- Reports ---
export const reportRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/report",
  component: () => "Report Page",
});

// --- Route Tree ---
export const routeTree = rootRoute.addChildren([
  indexRoute.addChildren([AuthLoginRoute]),
  protectedRoute.addChildren([
    dashboardRoute,
    // General
    generalAddressRoute,
    generalLocationRoute,
    generalEmployeeRoute,
    generalDisciplineRoute,
    generalCounterTypeRoute,
    generalMaintClassRoute,
    generalFollowStatusRoute,
    generalPendingTypeRoute,
    generalJobClassRoute,
    generalJobDescriptionRoute,
    // Maintenance
    maintFunctionRoute,
    maintComponentUnitRoute,
    maintComponentTypeRoute.addChildren([
      maintComponentTypeTreeRoute,
      maintComponentTypeListRoute,
    ]),
    maintComponentJobRoute,
    maintWorkOrderRoute,
    maintRoundRoute,
    maintUnplannedJobsRoute,
    maintRequisitionWorkRoute,
    maintComponentTriggerRoute,
    maintUpdateCounterRoute,
    maintCounterLogRoute,
    maintMeasurePointsRoute,
    maintMeasurePointsLogsRoute,
    maintMaintLogRoute,
    // Stock
    stockTypeRoute,
    stockItemRoute,
    stockUsedRoute,
    // Users & Reports
    usersRoute,
    reportRoute,
  ]),
]);
