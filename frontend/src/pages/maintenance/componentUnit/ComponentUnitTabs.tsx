import AccountTree from "@mui/icons-material/AccountTree";
import AttachFile from "@mui/icons-material/AttachFile";
import BarChart from "@mui/icons-material/BarChart";
import BugReport from "@mui/icons-material/BugReport";
import ContentCopy from "@mui/icons-material/ContentCopy";
import Description from "@mui/icons-material/Description";
import DoneAll from "@mui/icons-material/DoneAll";
import StackedLineChart from "@mui/icons-material/StackedLineChart";
import Tune from "@mui/icons-material/Tune";
import { lazy } from "react";
import { TypeTblComponentUnit } from "@/core/api/generated/api";
import TabsContainer, {
  ReusableTabItem,
} from "@/shared/components/TabsContainer";

// Lazy imports
const TabDetails = lazy(() => import("./tabs/TabDetails"));
const TabJob = lazy(() => import("./tabs/job/TabJob"));
const TabCounter = lazy(() => import("./tabs/counter/TabCounter"));
const TabWorkOrder = lazy(() => import("./tabs/TabWorkOrder"));
const TabMaintLog = lazy(() => import("./tabs/TabMaintLog"));
const TabAttachment = lazy(() => import("./tabs/TabAttachment"));
const TabUserAttachment = lazy(() => import("./tabs/TabUserAttachment"));
const TabFailureReport = lazy(() => import("./tabs/TabFailureReport"));
const TabMeasures = lazy(() => import("./tabs/measures/TabMeasures"));
const TabStockUsed = lazy(() => import("./tabs/TabStockUsed"));

type Props = {
  componentUnit?: TypeTblComponentUnit | undefined | null;
  label?: string | null;
};

// Define tabs
const tabs: ReusableTabItem[] = [
  {
    label: "Job",
    icon: <AccountTree />,
    component: TabJob,
  },
  { label: "Details", icon: <Description />, component: TabDetails },
  { label: "Counter", icon: <BarChart />, component: TabCounter },
  { label: "Measure Point", icon: <Tune />, component: TabMeasures },
  { label: "Failure Report", icon: <BugReport />, component: TabFailureReport },
  { label: "Work Order", icon: <ContentCopy />, component: TabWorkOrder },
  { label: "Maint Log", icon: <DoneAll />, component: TabMaintLog },
  {
    label: "Stock Used (not set)",
    icon: <StackedLineChart />,
    component: TabStockUsed,
  },
  { label: "Attachment", icon: <AttachFile />, component: TabAttachment },
  {
    label: "User Attachment",
    icon: <AttachFile />,
    component: TabUserAttachment,
  },
];

const ComponentUnitTabs = (props: Props) => {
  const { label, componentUnit } = props;

  return (
    <TabsContainer
      tabs={tabs}
      tabProps={{
        label,
        componentUnit,
      }}
    />
  );
};

export default ComponentUnitTabs;
