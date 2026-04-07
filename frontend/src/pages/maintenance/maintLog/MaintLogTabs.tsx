import AccountTree from "@mui/icons-material/AccountTree";
import AttachFile from "@mui/icons-material/AttachFile";
import Inventory from "@mui/icons-material/Inventory";
import TrackChanges from "@mui/icons-material/TrackChanges";
import ReportProblem from "@mui/icons-material/ReportProblem";
import Build from "@mui/icons-material/Build";
import Speed from "@mui/icons-material/Speed";
import Straighten from "@mui/icons-material/Straighten";
import Work from "@mui/icons-material/Work";
import { lazy, memo, useMemo } from "react";
import { TypeTblMaintLog } from "@/core/api/generated/api";
import TabsContainer, {
  ReusableTabItem,
} from "@/shared/components/TabsContainer";

// Lazy imports
const TabHistory = lazy(() => import("./tabs/TabHistory"));
const TabStockUsed = lazy(() => import("./tabs/tabStockUsed/TabStockUsed"));
const TabFollow = lazy(() => import("./tabs/tabFollow/TabFollow"));
const TabFailureReport = lazy(() => import("./tabs/TabFailureReport"));
const TabResourceUsed = lazy(
  () => import("./tabs/tabResourceUsed/TabResourceUsed"),
);
const TabLogCounter = lazy(() => import("./tabs/TabLogCounter"));
const TabMeasurePoint = lazy(
  () => import("./tabs/tabMeasurePoint/TabMeasurePoint"),
);
const TabWorkOrders = lazy(() => import("./tabs/TabWorkOrders"));
const TabAttachment = lazy(() => import("./tabs/TabAttachment"));

// Tabs
const tabs: ReusableTabItem[] = [
  { label: "History", icon: <AccountTree />, component: TabHistory },
  { label: "Stocks Used", icon: <Inventory />, component: TabStockUsed },
  { label: "Follow", icon: <TrackChanges />, component: TabFollow },
  {
    label: "Failure Report",
    icon: <ReportProblem />,
    component: TabFailureReport,
  },
  { label: "Resource Used", icon: <Build />, component: TabResourceUsed },
  { label: "Log Counter", icon: <Speed />, component: TabLogCounter },
  { label: "Measure Point", icon: <Straighten />, component: TabMeasurePoint },
  { label: "WorkOrders", icon: <Work />, component: TabWorkOrders },

  { label: "Attachment", icon: <AttachFile />, component: TabAttachment },
];

type Props = {
  selectedMaintLog?: TypeTblMaintLog | null;
  persistInUrl: boolean;
};

const TabsComponent = ({ selectedMaintLog, persistInUrl }: Props) => {
  const tabProps = useMemo(
    () => ({
      selected: selectedMaintLog,
      label: selectedMaintLog?.tblComponentUnit?.compNo,
    }),
    [selectedMaintLog?.maintLogId],
  );
  return (
    <TabsContainer
      tabs={tabs}
      tabProps={tabProps}
      persistInUrl={persistInUrl}
    />
  );
};

export default memo(TabsComponent);
