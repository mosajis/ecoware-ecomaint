import RouteAddress from "@/pages/general/address/AddressRoute";
import RouteCounterType from "@/pages/general/counterType/CounterTypeRoute";
import RouteLocation from "@/pages/general/location/LocationRoute";
import RouteEmployee from "@/pages/general/employee/EmployeeRoute";
import RouteDiscipline from "@/pages/general/discipline/DisciplineRoute";
import RouteMaintClass from "@/pages/general/maintClass/MaintClassRoute";
import RouteFollowStatus from "@/pages/general/followStatus/FollowStatusRoute";
import RoutePendingType from "@/pages/general/pendingType/PendingTypeRoute";
import RouteJobClass from "@/pages/general/jobClass/JobClassRoute";
import RouteJobDescription from "@/pages/general/jobDescription/JobDescriptionRoute";
import RouteJobTrigger from "@/pages/general/jobTrigger/JobTriggerRoute";
import RouteAttachment from "@/pages/general/attachment/AttachmentRoute";
import { createRoute, Outlet } from "@tanstack/react-router";
import { protectedRoute } from "../../app/router/routes/protected.routes";

// --- General parent route ---
export const generalRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "general",
  component: () => <Outlet />,
  beforeLoad: () => ({ breadcrumb: "General" }),
});

generalRoute.addChildren([
  RouteAddress,
  RouteCounterType,
  RouteLocation,
  RouteEmployee,
  RouteDiscipline,
  RouteMaintClass,
  RouteFollowStatus,
  RoutePendingType,
  RouteJobClass,
  RouteJobDescription,
  RouteJobTrigger,
  RouteAttachment,
]);

export default generalRoute;
