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
import PageFollowStatus from "@/pages/general/followStatus/FollowStatus";
import PagePendingType from "@/pages/general/pendingType/PendingType";
import PageJobClass from "@/pages/general/jobClass/JobClass";
import PageJobDescription from "@/pages/general/jobDescription/JobDescription";
import PageComponentTypeList from "@/pages/maintenance/componentType/ComponentType";
import PageComponentTypeTree from "@/pages/maintenance/componentType/ComponentTypeTree";
import PageFunction from "@/pages/maintenance/function/Function";
import ComponentTypeJob from "@/pages/maintenance/componentType/pages/ComponentTypeJob";

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
  beforeLoad: () => ({ breadcrumb: "Login" }),
});

// --- Dashboard ---
export const dashboardRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/dashboard",
  component: () => "Dashboard Page",
  beforeLoad: () => ({ breadcrumb: "Dashboard" }),
});

// --- General ---
export const generalAddressRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/general/address",
  component: PageAddress,
  beforeLoad: () => ({ breadcrumb: "Address" }),
});
export const generalLocationRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/general/location",
  component: PageLocation,
  beforeLoad: () => ({ breadcrumb: "Location" }),
});
export const generalEmployeeRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/general/employee",
  component: PageEmployee,
  beforeLoad: () => ({ breadcrumb: "Employee" }),
});
export const generalDisciplineRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/general/discipline",
  component: PageDiscipline,
  beforeLoad: () => ({ breadcrumb: "Discipline" }),
});
export const generalCounterTypeRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/general/counter-type",
  component: PageCounterType,
  beforeLoad: () => ({ breadcrumb: "Counter Type" }),
});
export const generalMaintClassRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/general/maint-class",
  component: PageMaintClass,
  beforeLoad: () => ({ breadcrumb: "Maint Class" }),
});
export const generalFollowStatusRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/general/follow-status",
  component: PageFollowStatus,
  beforeLoad: () => ({ breadcrumb: "Follow Status" }),
});
export const generalPendingTypeRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/general/pending-type",
  component: PagePendingType,
  beforeLoad: () => ({ breadcrumb: "Pending Type" }),
});
export const generalJobClassRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/general/job-class",
  component: PageJobClass,
  beforeLoad: () => ({ breadcrumb: "Job Class" }),
});
export const generalJobDescriptionRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/general/job-description",
  component: PageJobDescription,
  beforeLoad: () => ({ breadcrumb: "Job Description" }),
});

// --- Maintenance ---
// Function
export const maintFunctionRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/maintenance/function",
  beforeLoad: () => ({ breadcrumb: "Function" }),
});
export const maintFunctionListRoute = createRoute({
  getParentRoute: () => maintFunctionRoute,
  path: "list-view",
  component: PageFunction,
  beforeLoad: () => ({ breadcrumb: "List View" }),
});
export const maintFunctionTreeRoute = createRoute({
  getParentRoute: () => maintFunctionRoute,
  path: "tree-view",
  beforeLoad: () => ({ breadcrumb: "Tree View" }),
});

// Component Unit
export const maintComponentUnitRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/maintenance/component-unit",
  component: () => "Component Unit Page",
  beforeLoad: () => ({ breadcrumb: "Component Unit" }),
});

// Component Type
export const maintComponentTypeRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/maintenance/component-type",
  beforeLoad: () => ({ breadcrumb: "Component Type" }),
});
export const maintComponentTypeTreeRoute = createRoute({
  getParentRoute: () => maintComponentTypeRoute,
  path: "tree-view",
  component: PageComponentTypeTree,
  beforeLoad: () => ({ breadcrumb: "Tree View" }),
});
export const maintComponentTypeListRoute = createRoute({
  getParentRoute: () => maintComponentTypeRoute,
  path: "/",
  component: PageComponentTypeList,
  beforeLoad: () => ({ breadcrumb: "List View" }),
});
export const maintComponentTypeDetailRoute = createRoute({
  getParentRoute: () => maintComponentTypeRoute,
  path: "$id/job",
  component: ComponentTypeJob,
  beforeLoad: ({ params }) => ({
    breadcrumb: params?.id ?? "ComponentType",
  }),
});
// سایر Maintenance
export const maintComponentJobRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/maintenance/component-job",
  component: () => "Component Job Page",
  beforeLoad: () => ({ breadcrumb: "Component Job" }),
});
export const maintWorkOrderRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/maintenance/work-order",
  component: () => "Work Order Page",
  beforeLoad: () => ({ breadcrumb: "Work Order" }),
});
export const maintRoundRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/maintenance/round",
  component: () => "Round Page",
  beforeLoad: () => ({ breadcrumb: "Round" }),
});
export const maintUnplannedJobsRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/maintenance/unplanned-jobs",
  component: () => "Unplanned Jobs Page",
  beforeLoad: () => ({ breadcrumb: "Unplanned Jobs" }),
});
export const maintRequisitionWorkRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/maintenance/requisition-work",
  component: () => "Requisition Work Page",
  beforeLoad: () => ({ breadcrumb: "Requisition Work" }),
});
export const maintComponentTriggerRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/maintenance/component-trigger",
  component: () => "Component Trigger Page",
  beforeLoad: () => ({ breadcrumb: "Component Trigger" }),
});
export const maintUpdateCounterRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/maintenance/update-counter",
  component: () => "Update Counter Page",
  beforeLoad: () => ({ breadcrumb: "Update Counter" }),
});
export const maintCounterLogRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/maintenance/counter-log",
  component: () => "Counter Log Page",
  beforeLoad: () => ({ breadcrumb: "Counter Log" }),
});
export const maintMeasurePointsRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/maintenance/measure-points",
  component: () => "Measure Points Page",
  beforeLoad: () => ({ breadcrumb: "Measure Points" }),
});
export const maintMeasurePointsLogsRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/maintenance/measure-points-logs",
  component: () => "Measure Points Logs Page",
  beforeLoad: () => ({ breadcrumb: "Measure Points Logs" }),
});
export const maintMaintLogRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/maintenance/maint-log",
  component: () => "Maint Log Page",
  beforeLoad: () => ({ breadcrumb: "Maint Log" }),
});

// --- Stock ---
export const stockTypeRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/stock/stock-type",
  component: () => "Stock Type Page",
  beforeLoad: () => ({ breadcrumb: "Stock Type" }),
});
export const stockItemRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/stock/stock-item",
  component: () => "Stock Item Page",
  beforeLoad: () => ({ breadcrumb: "Stock Item" }),
});
export const stockUsedRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/stock/stock-used",
  component: () => "Stock Used Page",
  beforeLoad: () => ({ breadcrumb: "Stock Used" }),
});

// --- Users ---
export const usersRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/users",
  component: () => "Users Page",
  beforeLoad: () => ({ breadcrumb: "Users" }),
});

// --- Reports ---
export const reportRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/report",
  component: () => "Report Page",
  beforeLoad: () => ({ breadcrumb: "Reports" }),
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
    maintFunctionRoute.addChildren([
      maintFunctionListRoute,
      maintFunctionTreeRoute,
    ]),
    maintComponentUnitRoute,
    maintComponentTypeRoute.addChildren([
      maintComponentTypeTreeRoute,
      maintComponentTypeListRoute,
      maintComponentTypeDetailRoute,
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
