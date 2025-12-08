import { Outlet, redirect } from "@tanstack/react-router";
import { createRoute, createRootRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import AppLayout from "@/shared/components/layout/AppLayout";
import { LOCAL_STORAGE } from "@/const";
import AppAuthorization from "@/shared/components/AppAthorization";
import Spinner from "@/shared/components/Spinner";

// Lazy load all page components
const PageLogin = lazy(() => import("@/pages/auth/login/login.page"));
const PageAddress = lazy(() => import("@/pages/general/address/Address"));
const PageLocation = lazy(() => import("@/pages/general/location/Location"));
const PageEmployee = lazy(() => import("@/pages/general/employee/Employee"));
const PageDiscipline = lazy(
  () => import("@/pages/general/discipline/Discipline")
);
const PageCounterType = lazy(
  () => import("@/pages/general/counterType/CounterType")
);
const PageMaintClass = lazy(
  () => import("@/pages/general/maintClass/MaintClass")
);
const PageFollowStatus = lazy(
  () => import("@/pages/general/followStatus/FollowStatus")
);
const PagePendingType = lazy(
  () => import("@/pages/general/pendingType/PendingType")
);
const PageJobClass = lazy(() => import("@/pages/general/jobClass/JobClass"));
const PageJobDescription = lazy(
  () => import("@/pages/general/jobDescription/JobDescription")
);
const PageComponentTypeList = lazy(
  () => import("@/pages/maintenance/componentType/ComponentType")
);
const PageComponentTypeTree = lazy(
  () => import("@/pages/maintenance/componentType/ComponentTypeTree")
);
const PageFunction = lazy(
  () => import("@/pages/maintenance/function/Function")
);
const PageFunctionTree = lazy(
  () => import("@/pages/maintenance/function/FunctionTree")
);
const ComponentTypeJob = lazy(
  () => import("@/pages/maintenance/componentType/pages/ComponentTypeJob")
);

// Loading fallback component
const LoadingFallback = () => <Spinner />;

// Wrapper for lazy components
const LazyComponent = ({
  Component,
}: {
  Component: React.ComponentType<any>;
}) => (
  <Suspense fallback={<LoadingFallback />}>
    <Component />
  </Suspense>
);

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
  component: () => <LazyComponent Component={PageLogin} />,
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
  component: () => <LazyComponent Component={PageAddress} />,
  beforeLoad: () => ({ breadcrumb: "Address" }),
});

export const generalLocationRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/general/location",
  component: () => <LazyComponent Component={PageLocation} />,
  beforeLoad: () => ({ breadcrumb: "Location" }),
});

export const generalEmployeeRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/general/employee",
  component: () => <LazyComponent Component={PageEmployee} />,
  beforeLoad: () => ({ breadcrumb: "Employee" }),
});

export const generalDisciplineRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/general/discipline",
  component: () => <LazyComponent Component={PageDiscipline} />,
  beforeLoad: () => ({ breadcrumb: "Discipline" }),
});

export const generalCounterTypeRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/general/counter-type",
  component: () => <LazyComponent Component={PageCounterType} />,
  beforeLoad: () => ({ breadcrumb: "Counter Type" }),
});

export const generalMaintClassRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/general/maint-class",
  component: () => <LazyComponent Component={PageMaintClass} />,
  beforeLoad: () => ({ breadcrumb: "Maint Class" }),
});

export const generalFollowStatusRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/general/follow-status",
  component: () => <LazyComponent Component={PageFollowStatus} />,
  beforeLoad: () => ({ breadcrumb: "Follow Status" }),
});

export const generalPendingTypeRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/general/pending-type",
  component: () => <LazyComponent Component={PagePendingType} />,
  beforeLoad: () => ({ breadcrumb: "Pending Type" }),
});

export const generalJobClassRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/general/job-class",
  component: () => <LazyComponent Component={PageJobClass} />,
  beforeLoad: () => ({ breadcrumb: "Job Class" }),
});

export const generalJobDescriptionRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/general/job-description",
  component: () => <LazyComponent Component={PageJobDescription} />,
  beforeLoad: () => ({ breadcrumb: "Job Description" }),
});

// --- Maintenance ---
export const maintFunctionRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/maintenance/function",
  beforeLoad: () => ({ breadcrumb: "Function" }),
});

export const maintFunctionListRoute = createRoute({
  getParentRoute: () => maintFunctionRoute,
  path: "/",
  component: () => <LazyComponent Component={PageFunction} />,
  beforeLoad: () => ({ breadcrumb: "List View" }),
});

export const maintFunctionTreeRoute = createRoute({
  getParentRoute: () => maintFunctionRoute,
  path: "/tree-view",
  component: () => <LazyComponent Component={PageFunctionTree} />,
  beforeLoad: () => ({ breadcrumb: "Tree View" }),
});

export const maintComponentUnitRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/maintenance/component-unit",
  component: () => "Component Unit Page",
  beforeLoad: () => ({ breadcrumb: "Component Unit" }),
});

export const maintComponentTypeRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/maintenance/component-type",
  beforeLoad: () => ({ breadcrumb: "Component Type" }),
});

export const maintComponentTypeTreeRoute = createRoute({
  getParentRoute: () => maintComponentTypeRoute,
  path: "tree-view",
  component: () => <LazyComponent Component={PageComponentTypeTree} />,
  beforeLoad: () => ({ breadcrumb: "Tree View" }),
});

export const maintComponentTypeListRoute = createRoute({
  getParentRoute: () => maintComponentTypeRoute,
  path: "/",
  component: () => <LazyComponent Component={PageComponentTypeList} />,
  beforeLoad: () => ({ breadcrumb: "List View" }),
});

export const maintComponentTypeDetailRoute = createRoute({
  getParentRoute: () => maintComponentTypeRoute,
  path: "$id/job",
  component: () => <LazyComponent Component={ComponentTypeJob} />,
});

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

// --- Route Tree ---
export const routeTree = rootRoute.addChildren([
  indexRoute.addChildren([AuthLoginRoute]),
  protectedRoute.addChildren([
    dashboardRoute,
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
    // ... باقی routes
  ]),
]);
