import EditNoteIcon from "@mui/icons-material/EditNote";
import { lazy } from "react";
import {
  AccountTree,
  AttachFile,
  BarChart,
  BugReport,
  ContentCopy,
} from "@mui/icons-material";
import TabsContainer, {
  ReusableTabItem,
} from "@/shared/components/TabsContainer";

// Lazy imports

const TabCounter = lazy(
  () => import("@/pages/maintenance/componentType/tabs/TabCounter")
);

const TabMeasures = lazy(
  () => import("@/pages/maintenance/componentType/tabs/TabMeasures")
);

// Define tabs using the reusable format
const tabs: ReusableTabItem[] = [
  { label: "Counter", icon: <BarChart />, component: TabCounter },
  { label: "Measure", icon: <EditNoteIcon />, component: TabMeasures },
];

type Props = {
  selectedCompTypeId?: number | undefined | null;
};

const ComponentTypeJobTabs = ({ selectedCompTypeId }: Props) => {
  return (
    <TabsContainer
      tabs={tabs}
      queryParamKey="tab"
      fillHeight={true}
      tabProps={{ selected: selectedCompTypeId }}
    />
  );
};

export default ComponentTypeJobTabs;
