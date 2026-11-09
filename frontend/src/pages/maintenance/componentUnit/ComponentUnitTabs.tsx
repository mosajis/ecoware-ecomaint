import AccountTree from "@mui/icons-material/AccountTree";
import Assignment from "@mui/icons-material/Assignment";
import AttachFile from "@mui/icons-material/AttachFile";
import BarChart from "@mui/icons-material/BarChart";
import BugReport from "@mui/icons-material/BugReport";
import Build from "@mui/icons-material/Build";
import Description from "@mui/icons-material/Description";
import Handyman from "@mui/icons-material/Handyman";
import History from "@mui/icons-material/History";
import Inventory2 from "@mui/icons-material/Inventory2";
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
const TabSpareUsed = lazy(() => import("./tabs/TabSpareUsed"));
const TabWorkshop = lazy(() => import("./tabs/workshop/TabWorkShop"));
const TabPart = lazy(() => import("./tabs/part/TabPart"));

type Props = {
  componentUnit?: TypeTblComponentUnit | undefined | null;
  label?: string | null;
};

const tabs: ReusableTabItem[] = [
  {
    label: "Job",
    icon: <AccountTree />,
    component: TabJob,
  },
  {
    label: "Notes",
    icon: <Description />,
    component: TabDetails,
  },
  {
    label: "Counter",
    icon: <BarChart />,
    component: TabCounter,
  },
  {
    label: "Measure Point",
    icon: <Tune />,
    component: TabMeasures,
  },
  {
    label: "Failure Report",
    icon: <BugReport />,
    component: TabFailureReport,
  },
  {
    label: "Work Order",
    icon: <Assignment />,
    component: TabWorkOrder,
  },
  {
    label: "Maint Log",
    icon: <History />,
    component: TabMaintLog,
  },
  {
    label: "Part List",
    icon: <Inventory2 />,
    component: TabPart,
  },
  {
    label: "Spare Used",
    icon: <Build />,
    component: TabSpareUsed,
  },
  {
    label: "WorkShop",
    icon: <Handyman />,
    component: TabWorkshop,
  },
  {
    label: "Attachment",
    icon: <AttachFile />,
    component: TabAttachment,
  },
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
