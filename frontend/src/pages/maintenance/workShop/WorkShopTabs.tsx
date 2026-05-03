import PrecisionManufacturing from "@mui/icons-material/PrecisionManufacturing";
import AttachFile from "@mui/icons-material/AttachFile";
import { lazy } from "react";
import TabsContainer, {
  ReusableTabItem,
} from "@/shared/components/TabsContainer";

const Components = lazy(() => import("./tabs/tabComponents/TabComponentUnit"));
const Attachments = lazy(() => import("./tabs/TabAttachments"));

type Props = {
  label?: string | null;
  workShopId?: number | null;
};

const WorkShopTabs = ({ workShopId, label }: Props) => {
  const tabs: ReusableTabItem[] = [
    {
      label: "Components",
      icon: <PrecisionManufacturing />,
      component: Components,
    },
    {
      label: "Attachments",
      icon: <AttachFile />,
      component: Attachments,
    },
  ];

  return (
    <TabsContainer
      tabs={tabs}
      persistInUrl={false}
      tabProps={{
        label,
        workShopId,
      }}
    />
  );
};

export default WorkShopTabs;
