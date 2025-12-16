import { lazy } from "react";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import DescriptionIcon from "@mui/icons-material/Description";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import FolderZipIcon from "@mui/icons-material/FolderZip";
import BuildIcon from "@mui/icons-material/Build";
import MemoryIcon from "@mui/icons-material/Memory";
import StraightenIcon from "@mui/icons-material/Straighten";
import ScheduleIcon from "@mui/icons-material/Schedule";
import TabsContainer from "@/shared/components/TabsContainer";
import { TypeTblWorkOrder } from "@/core/api/generated/api";

const TabJobDescription = lazy(() => import("./tabs/TabJobDescription"));
const TabPendingDetails = lazy(() => import("./tabs/TabPendingDetail"));
const TabJobAttachments = lazy(() => import("./tabs/TabJobAttachments"));
const TabWoAttachments = lazy(() => import("./tabs/TabWoAttachments"));
const TabMaintenanceLog = lazy(() => import("./tabs/TabMaintenanceLog"));
const TabComponentLog = lazy(() => import("./tabs/TabComponentLog"));
const TabMeasurePoints = lazy(() => import("./tabs/TabMeasurePoints"));
const TabRescheduleLog = lazy(() => import("./tabs/TabRescheduleLog"));

const tabs = [
  {
    label: "Job Description",
    icon: <DescriptionIcon />,
    component: TabJobDescription,
  },
  {
    label: "Pending Details",
    icon: <HourglassEmptyIcon />,
    component: TabPendingDetails,
  },

  {
    label: "Maintenance Log",
    icon: <BuildIcon />,
    component: TabMaintenanceLog,
  },
  {
    label: "Component Log",
    icon: <MemoryIcon />,
    component: TabComponentLog,
  },
  {
    label: "Measure Points",
    icon: <StraightenIcon />,
    component: TabMeasurePoints,
  },
  {
    label: "Reschedule Log",
    icon: <ScheduleIcon />,
    component: TabRescheduleLog,
  },
  {
    label: "Job Attachments",
    icon: <AttachFileIcon />,
    component: TabJobAttachments,
  },
  {
    label: "WO Attachments",
    icon: <FolderZipIcon />,
    component: TabWoAttachments,
  },
];

type Props = {
  workOrder?: TypeTblWorkOrder | null;
};

const TabsComponent = (props: Props) => {
  const { workOrder } = props;
  const label = workOrder?.title;

  return (
    <TabsContainer
      tabs={tabs}
      queryParamKey="tab"
      tabProps={{
        workOrder,
        label,
      }}
    />
  );
};

export default TabsComponent;
