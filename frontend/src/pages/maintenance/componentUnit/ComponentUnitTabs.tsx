import TabsContainer, {
  ReusableTabItem,
} from "@/shared/components/TabsContainer";
import { lazy } from "react";
import {
  AccountTree,
  AddBox,
  AttachFile,
  BarChart,
  Book,
  BugReport,
  Build,
  CheckCircle,
  ColorLens,
  ContentCopy,
  Description,
  DirectionsCar,
  DoneAll,
  Inbox,
  StackedLineChart,
  Tune,
} from "@mui/icons-material";

// Lazy imports
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
const TabJobAttachment = lazy(
  () => import("@/pages/maintenance/componentType/tabs/TabJobAttachment")
);
const TabFailureReport = lazy(
  () => import("@/pages/maintenance/componentType/tabs/TabFailureReport")
);
const TabPerformed = lazy(
  () => import("@/pages/maintenance/componentType/tabs/TabPerformed")
);
const TabPart = lazy(
  () => import("@/pages/maintenance/componentType/tabs/TabPart")
);
const TabMeasures = lazy(
  () => import("@/pages/maintenance/componentType/tabs/TabMeasures")
);
const TabOilInfo = lazy(
  () => import("@/pages/maintenance/componentType/tabs/TabOilInfo")
);
const TabStockUsed = lazy(
  () => import("@/pages/maintenance/componentType/tabs/TabStockUsed")
);

const TabWorkshop = lazy(
  () => import("@/pages/maintenance/componentType/tabs/TabWorkshop")
);
const TabMaterialRequests = lazy(
  () => import("@/pages/maintenance/componentType/tabs/TabMaterialRequests")
);

// Define tabs
const tabs: ReusableTabItem[] = [
  { label: "Details", icon: <Description />, component: TabDetails },
  { label: "Job", icon: <AccountTree />, component: TabJob },
  { label: "Counter", icon: <BarChart />, component: TabCounter },
  { label: "Work Order", icon: <ContentCopy />, component: TabWorkOrder },
  { label: "Maint Log", icon: <DoneAll />, component: TabMaintLog },
  { label: "Attachment", icon: <AttachFile />, component: TabAttachment },
  { label: "Job Attachment", icon: <AddBox />, component: TabJobAttachment },
  { label: "Failure Report", icon: <BugReport />, component: TabFailureReport },
  { label: "Performed", icon: <CheckCircle />, component: TabPerformed },
  { label: "Part", icon: <Build />, component: TabPart },
  { label: "Measures", icon: <Tune />, component: TabMeasures },
  { label: "Oil Info", icon: <ColorLens />, component: TabOilInfo },
  { label: "Stock Used", icon: <StackedLineChart />, component: TabStockUsed },
  { label: "Workshop", icon: <DirectionsCar />, component: TabWorkshop },
  {
    label: "Material Requests",
    icon: <Inbox />,
    component: TabMaterialRequests,
  },
];

const ComponentUnitTabs = () => {
  return <TabsContainer tabs={tabs} queryParamKey="tab" fillHeight />;
};

export default ComponentUnitTabs;
