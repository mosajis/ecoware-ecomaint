import { createRoute, Outlet } from "@tanstack/react-router";
import { LazyRoute } from "./_components/lazyRoute";
import { protectedRoute } from "./protected.routes";
import { lazy } from "react";

// --- Lazy pages ---
export const PageAttachment = lazy(
  () => import("@/pages/general/attachment/Attachment"),
);
export const PageAddress = lazy(
  () => import("@/pages/general/address/Address"),
);
export const PageLocation = lazy(
  () => import("@/pages/general/location/Location"),
);
export const PageEmployee = lazy(
  () => import("@/pages/general/employee/Employee"),
);
export const PageDiscipline = lazy(
  () => import("@/pages/general/discipline/Discipline"),
);
export const PageCounterType = lazy(
  () => import("@/pages/general/counterType/CounterType"),
);
export const PageMaintClass = lazy(
  () => import("@/pages/general/maintClass/MaintClass"),
);
export const PageFollowStatus = lazy(
  () => import("@/pages/general/followStatus/FollowStatus"),
);
export const PagePendingType = lazy(
  () => import("@/pages/general/pendingType/PendingType"),
);
export const PageJobClass = lazy(
  () => import("@/pages/general/jobClass/JobClass"),
);
export const PageJobDescription = lazy(
  () => import("@/pages/general/jobDescription/JobDescription"),
);
export const PageJobTrigger = lazy(
  () => import("@/pages/general/jobTrigger/JobTrigger"),
);

// --- General parent route ---
export const generalRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "general",
  component: () => <Outlet />,
  beforeLoad: () => ({ breadcrumb: "General" }),
});

// --- General children ---
export const generalAttachmentRoute = createRoute({
  getParentRoute: () => generalRoute,
  path: "attachment",
  component: () => <LazyRoute Component={PageAttachment} />,
  beforeLoad: () => ({ breadcrumb: "Attachment" }),
});
export const generalAddressRoute = createRoute({
  getParentRoute: () => generalRoute,
  path: "address",
  component: () => <LazyRoute Component={PageAddress} />,
  beforeLoad: () => ({ breadcrumb: "Address" }),
});

export const generalLocationRoute = createRoute({
  getParentRoute: () => generalRoute,
  path: "location",
  component: () => <LazyRoute Component={PageLocation} />,
  beforeLoad: () => ({ breadcrumb: "Location" }),
});

export const generalEmployeeRoute = createRoute({
  getParentRoute: () => generalRoute,
  path: "employee",
  component: () => <LazyRoute Component={PageEmployee} />,
  beforeLoad: () => ({ breadcrumb: "Employee" }),
});

export const generalDisciplineRoute = createRoute({
  getParentRoute: () => generalRoute,
  path: "discipline",
  component: () => <LazyRoute Component={PageDiscipline} />,
  beforeLoad: () => ({ breadcrumb: "Discipline" }),
});

export const generalCounterTypeRoute = createRoute({
  getParentRoute: () => generalRoute,
  path: "counter-type",
  component: () => <LazyRoute Component={PageCounterType} />,
  beforeLoad: () => ({ breadcrumb: "Counter Type" }),
});

export const generalMaintClassRoute = createRoute({
  getParentRoute: () => generalRoute,
  path: "maint-class",
  component: () => <LazyRoute Component={PageMaintClass} />,
  beforeLoad: () => ({ breadcrumb: "Maint Class" }),
});

export const generalFollowStatusRoute = createRoute({
  getParentRoute: () => generalRoute,
  path: "follow-status",
  component: () => <LazyRoute Component={PageFollowStatus} />,
  beforeLoad: () => ({ breadcrumb: "Follow Status" }),
});

export const generalPendingTypeRoute = createRoute({
  getParentRoute: () => generalRoute,
  path: "pending-type",
  component: () => <LazyRoute Component={PagePendingType} />,
  beforeLoad: () => ({ breadcrumb: "Pending Type" }),
});

export const generalJobClassRoute = createRoute({
  getParentRoute: () => generalRoute,
  path: "job-class",
  component: () => <LazyRoute Component={PageJobClass} />,
  beforeLoad: () => ({ breadcrumb: "Job Class" }),
});

export const generalJobDescriptionRoute = createRoute({
  getParentRoute: () => generalRoute,
  path: "job-description",
  component: () => <LazyRoute Component={PageJobDescription} />,
  beforeLoad: () => ({ breadcrumb: "Job Description" }),
});

export const generalJobTriggerRoute = createRoute({
  getParentRoute: () => generalRoute,
  path: "job-trigger",
  component: () => <LazyRoute Component={PageJobTrigger} />,
  beforeLoad: () => ({ breadcrumb: "Job Trigger" }),
});

// --- Add all children to parent ---
export const generalRouteTree = generalRoute.addChildren([
  generalAttachmentRoute,
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
  generalJobTriggerRoute,
]);
