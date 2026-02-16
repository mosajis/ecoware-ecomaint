import Build from "@mui/icons-material/Build";
import Inventory from "@mui/icons-material/Inventory";
import AttachFile from "@mui/icons-material/AttachFile";
import Report from "@mui/icons-material/Report";
import { lazy } from "react";
import TabsContainer, {
  ReusableTabItem,
} from "@/shared/components/TabsContainer";
import { useAtomValue } from "jotai";
import { failureReportAtom } from "./FailureReportAtom";

const General = lazy(() => import("./tabs/tabGeneral/TabGeneral"));
const ResourceUsed = lazy(
  () => import("./tabs/tabResourceUsed/TabResourceUsed"),
);
const StockUsed = lazy(() => import("./tabs/tabStockUsed/TabStockUsed"));
const Attachments = lazy(() => import("./tabs/TabAttachment"));

type Props = {
  mode: "create" | "update";
  failureReportId?: number | null;
  compId?: number;
};

const FailureReportTabs = ({ mode, failureReportId, compId }: Props) => {
  const { maintLog } = useAtomValue(failureReportAtom);

  const tabs: ReusableTabItem[] = [
    {
      label: "General",
      icon: <Report />,
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
  ];

  return (
    <TabsContainer
      tabs={tabs}
      persistInUrl={false}
      tabProps={{
        mode,
        failureReportId,
        compId,
      }}
    />
  );
};

export default FailureReportTabs;
