import EditNoteIcon from "@mui/icons-material/EditNote";
import { lazy } from "react";
import {
  AccountTree,
  AttachFile,
  BarChart,
  BugReport,
  ContentCopy,
} from "@mui/icons-material";
import TabsContainer, {
  ReusableTabItem,
} from "@/shared/components/TabsContainer";

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
const TabComponentUnit = lazy(
  () => import("@/pages/maintenance/componentType/tabs/TabComponentUnit")
);

// Define tabs using the reusable format
const tabs: ReusableTabItem[] = [
  { label: "Job", icon: <AccountTree />, component: TabJob },
  { label: "Counter", icon: <BarChart />, component: TabCounter },
  { label: "Component", icon: <ContentCopy />, component: TabComponentUnit },
  { label: "Measure", icon: <EditNoteIcon />, component: TabMeasures },
  { label: "Attachment", icon: <AttachFile />, component: TabAttachment },
  { label: "Spare", icon: <BugReport />, component: TabFailureReport },
];

type Props = {
  selectedCompTypeId?: number | undefined | null;
};

const ComponentTypeTabs = ({ selectedCompTypeId }: Props) => {
  return (
    <TabsContainer
      tabs={tabs}
      queryParamKey="tab"
      fillHeight={true}
      selected={selectedCompTypeId}
    />
  );
};

export default ComponentTypeTabs;
