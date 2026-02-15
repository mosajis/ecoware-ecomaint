import AccountTree from "@mui/icons-material/AccountTree";
import Build from "@mui/icons-material/Build";
import Inventory from "@mui/icons-material/Inventory";
import AttachFile from "@mui/icons-material/AttachFile";
import Straighten from "@mui/icons-material/Straighten";
import { lazy } from "react";
import TabsContainer, {
  ReusableTabItem,
} from "@/shared/components/TabsContainer";
import { useAtom } from "jotai";
import { reportWorkAtom } from "./ReportWorkAtom";

// Lazy imports
const General = lazy(() => import("./steps/stepGeneral/StepGeneral"));
const ResourceUsed = lazy(
  () => import("./steps/stepResourceUsed/StepResourceUsed"),
);
const StockUsed = lazy(() => import("./steps/stepStockUsed/StepStockUsed"));
const Attachments = lazy(() => import("./steps/StepAttachments"));
const MeasurePoints = lazy(() => import("./steps/StepMeasurePoints"));

const ReportWorkTabs = () => {
  const [reportWork, setReportWork] = useAtom(reportWorkAtom);

  const { maintLog, workOrder } = reportWork;

  // Define tabs using reusable format
  const tabs: ReusableTabItem[] = [
    {
      label: "General",
      icon: <AccountTree />,
      component: General,
    },
    {
      label: "Resource Used",
      icon: <Build />,
      component: ResourceUsed,
      disabled: !maintLog?.maintLogId,
    },
    {
      label: "Stock Used",
      icon: <Inventory />,
      component: StockUsed,
      disabled: !maintLog?.maintLogId,
    },
    {
      label: "Attachments",
      icon: <AttachFile />,
      component: Attachments,
      disabled: !maintLog?.maintLogId,
    },
    {
      label: "Measure Points",
      icon: <Straighten />,
      component: MeasurePoints,
      disabled: !maintLog?.maintLogId || !workOrder?.tblCompJob?.compJobId,
    },
  ];
  return <TabsContainer tabs={tabs} persistInUrl={false} />;
};

export default ReportWorkTabs;
