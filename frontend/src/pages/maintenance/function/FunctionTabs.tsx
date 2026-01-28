import AccountTree from "@mui/icons-material/AccountTree";
import BarChart from "@mui/icons-material/BarChart";
import ContentCopy from "@mui/icons-material/ContentCopy";
import DoneAll from "@mui/icons-material/DoneAll";
import BugReport from "@mui/icons-material/BugReport";
import RestoreIcon from "@mui/icons-material/Restore";
import TabsContainer, {
  ReusableTabItem,
} from "@/shared/components/TabsContainer";
import { lazy } from "react";
import { TypeTblFunctions } from "@/core/api/generated/api";

// Lazy-loaded components
const TabJob = lazy(() => import("./tabs/TabJob"));
const TabCounter = lazy(() => import("./tabs/TabCounter"));
const TabWorkOrder = lazy(() => import("./tabs/TabWorkOrder"));
const TabMaintLog = lazy(() => import("./tabs/TabMaintLog"));
const TabFailureReport = lazy(() => import("./tabs/TabFailureReport"));
const TabRotationLog = lazy(() => import("./tabs/TabRotationLog"));

type Props = {
  recordFunction?: TypeTblFunctions;
  label?: string;
};

const TabsComponent = (props: Props) => {
  const { recordFunction, label } = props;

  // Tabs definition
  const tabs: ReusableTabItem[] = [
    {
      label: "RotaionLog",
      icon: <RestoreIcon />,
      component: TabRotationLog,
    },
    {
      label: "Job",
      icon: <AccountTree />,
      component: TabJob,
      disabled: !recordFunction?.tblComponentUnit?.compId,
    },
    {
      label: "Counter",
      icon: <BarChart />,
      component: TabCounter,
      disabled: !recordFunction?.tblComponentUnit?.compId,
    },
    {
      label: "Work Order",
      icon: <ContentCopy />,
      component: TabWorkOrder,
      disabled: !recordFunction?.tblComponentUnit?.compId,
    },
    {
      label: "Maint Log",
      icon: <DoneAll />,
      component: TabMaintLog,
      disabled: !recordFunction?.tblComponentUnit?.compId,
    },
    {
      label: "Failure Report",
      icon: <BugReport />,
      component: TabFailureReport,
      disabled: !recordFunction?.tblComponentUnit?.compId,
    },
  ];

  return <TabsContainer tabs={tabs} tabProps={{ recordFunction, label }} />;
};

export default TabsComponent;
