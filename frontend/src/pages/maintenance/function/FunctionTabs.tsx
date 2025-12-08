import { lazy } from "react";
import Description from "@mui/icons-material/Description";
import AccountTree from "@mui/icons-material/AccountTree";
import BarChart from "@mui/icons-material/BarChart";
import ContentCopy from "@mui/icons-material/ContentCopy";
import DoneAll from "@mui/icons-material/DoneAll";
import AttachFile from "@mui/icons-material/AttachFile";
import BugReport from "@mui/icons-material/BugReport";
import RestoreIcon from "@mui/icons-material/Restore";
import TabsContainer, {
  ReusableTabItem,
} from "@/shared/components/TabsContainer";

// Lazy-loaded components
const TabDetails = lazy(() => import("./tabs/TabDetails"));
const TabJob = lazy(() => import("./tabs/TabJob"));
const TabCounter = lazy(() => import("./tabs/TabCounter"));
const TabWorkOrder = lazy(() => import("./tabs/TabWorkOrder"));
const TabMaintLog = lazy(() => import("./tabs/TabMaintLog"));
const TabAttachment = lazy(() => import("./tabs/TabAttachment"));
const TabFailureReport = lazy(() => import("./tabs/TabFailureReport"));
const TabRotationLog = lazy(() => import("./tabs/TabRotationLog"));

// Tabs definition
const tabs: ReusableTabItem[] = [
  { label: "Details", icon: <Description />, component: TabDetails },
  { label: "RotaionLog", icon: <RestoreIcon />, component: TabRotationLog },
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
