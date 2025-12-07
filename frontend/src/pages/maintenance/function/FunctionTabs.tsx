import { lazy } from "react";
import Description from "@mui/icons-material/Description";
import AccountTree from "@mui/icons-material/AccountTree";
import BarChart from "@mui/icons-material/BarChart";
import ContentCopy from "@mui/icons-material/ContentCopy";
import DoneAll from "@mui/icons-material/DoneAll";
import AttachFile from "@mui/icons-material/AttachFile";
import BugReport from "@mui/icons-material/BugReport";
import EditNote from "@mui/icons-material/EditNote";
import TabsContainer, {
  ReusableTabItem,
} from "@/shared/components/TabsContainer";

// Lazy-loaded components
const TabDetails = lazy(
  () => import("@/pages/maintenance/componentType/tabs/TabDetails")
);
const TabJob = lazy(
  () => import("@/pages/maintenance/componentType/tabs/TabJob")
);
const TabCounter = lazy(
  () => import("@/pages/maintenance/componentType/tabs/TabCounter")
);
const TabWorkOrder = lazy(
  () => import("@/pages/maintenance/componentType/tabs/TabWorkOrder")
);
const TabMaintLog = lazy(
  () => import("@/pages/maintenance/componentType/tabs/TabMaintLog")
);
const TabAttachment = lazy(
  () => import("@/pages/maintenance/componentType/tabs/TabAttachment")
);
const TabFailureReport = lazy(
  () => import("@/pages/maintenance/componentType/tabs/TabFailureReport")
);

// Tabs definition
const tabs: ReusableTabItem[] = [
  { label: "Details", icon: <Description />, component: TabDetails },
  { label: "Job", icon: <AccountTree />, component: TabJob },
  { label: "Counter", icon: <BarChart />, component: TabCounter },
  { label: "Work Order", icon: <ContentCopy />, component: TabWorkOrder },
  { label: "Maint Log", icon: <DoneAll />, component: TabMaintLog },
  { label: "Attachment", icon: <AttachFile />, component: TabAttachment },
  { label: "Failure Report", icon: <BugReport />, component: TabFailureReport },
];

const TabsComponent = () => {
  return <TabsContainer tabs={tabs} queryParamKey="tab" />;
};

export default TabsComponent;
