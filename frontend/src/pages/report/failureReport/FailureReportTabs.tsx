import Build from "@mui/icons-material/Build";
import Inventory from "@mui/icons-material/Inventory";
import AttachFile from "@mui/icons-material/AttachFile";
import { lazy } from "react";
import TabsContainer, {
  ReusableTabItem,
} from "@/shared/components/TabsContainer";
import { TypeTblFailureReport } from "@/core/api/generated/api";

const SpareUsed = lazy(() => import("./tabs/tabSpareUsed/TabSpareUsed"));
const Attachments = lazy(() => import("./tabs/TabAttachment"));
const ResourceUsed = lazy(
  () => import("./tabs/tabResourceUsed/TabResourceUsed"),
);

type Props = {
  failreReport?: TypeTblFailureReport;
};

const Tabs = ({ failreReport }: Props) => {
  const tabs: ReusableTabItem[] = [
    {
      label: "Resource Used",
      icon: <Build />,
      component: ResourceUsed,
    },
    {
      label: "Spare Used",
      icon: <Inventory />,
      component: SpareUsed,
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
      persistInUrl={true}
      tabProps={{ failreReport }}
    />
  );
};

export default Tabs;
