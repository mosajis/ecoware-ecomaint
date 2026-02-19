import Settings from "@mui/icons-material/Settings";
import PrecisionManufacturing from "@mui/icons-material/PrecisionManufacturing";
import AttachFile from "@mui/icons-material/AttachFile";
import { lazy } from "react";
import TabsContainer, {
  ReusableTabItem,
} from "@/shared/components/TabsContainer";

const General = lazy(() => import("./tabs/tabGeneral/TabGeneral"));
const Components = lazy(() => import("./tabs/tabComponents/TabComponentUnit"));
const Attachments = lazy(() => import("./tabs/TabAttachments"));

type Props = {
  mode: "create" | "update";
  workShopId?: number | null;
};

const WorkShopTabs = ({ mode, workShopId }: Props) => {
  const tabs: ReusableTabItem[] = [
    {
      label: "General",
      icon: <Settings />,
      component: General,
    },
    {
      label: "Components",
      icon: <PrecisionManufacturing />,
      component: Components,
      disabled: !workShopId && mode === "create",
    },
    {
      label: "Attachments",
      icon: <AttachFile />,
      component: Attachments,
      disabled: !workShopId && mode === "create",
    },
  ];

  return (
    <TabsContainer
      tabs={tabs}
      persistInUrl={false}
      tabProps={{
        mode,
        workShopId,
      }}
    />
  );
};

export default WorkShopTabs;
