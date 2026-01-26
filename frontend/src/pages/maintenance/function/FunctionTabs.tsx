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
import { lazy } from "react";

// Lazy-loaded components
const TabDetails = lazy(() => import("./tabs/TabDetails"));
const TabJob = lazy(() => import("./tabs/TabJob"));
const TabCounter = lazy(() => import("./tabs/TabCounter"));
const TabWorkOrder = lazy(() => import("./tabs/TabWorkOrder"));
const TabMaintLog = lazy(() => import("./tabs/TabMaintLog"));
const TabFailureReport = lazy(() => import("./tabs/TabFailureReport"));
const TabRotationLog = lazy(() => import("./tabs/TabRotationLog"));

// Tabs definition
const tabs: ReusableTabItem[] = [
  { label: "Details (not set)", icon: <Description />, component: TabDetails },
  {
    label: "RotaionLog (not set)",
    icon: <RestoreIcon />,
    component: TabRotationLog,
  },
  { label: "Job (not set)", icon: <AccountTree />, component: TabJob },
  { label: "Counter (not set)", icon: <BarChart />, component: TabCounter },
  {
    label: "Work Order (not set)",
    icon: <ContentCopy />,
    component: TabWorkOrder,
  },
  { label: "Maint Log (not set)", icon: <DoneAll />, component: TabMaintLog },
  {
    label: "Failure Report (not set)",
    icon: <BugReport />,
    component: TabFailureReport,
  },
];

type Props = {
  functionId?: number | undefined | null;
  label?: string | null;
};

const TabsComponent = (props: Props) => {
  const { functionId, label } = props;
  return <TabsContainer tabs={tabs} tabProps={{ functionId, label }} />;
};

export default TabsComponent;
