import EditNoteIcon from "@mui/icons-material/EditNote";
import TabsContainer, {
  ReusableTabItem,
} from "@/shared/components/TabsContainer";
import { lazy } from "react";
import AccountTree from "@mui/icons-material/AccountTree";
import BarChart from "@mui/icons-material/BarChart";
import ContentCopy from "@mui/icons-material/ContentCopy";

// Lazy imports
const TabCompUnitCounter = lazy(() => import("./tabs/TabCompUnit"));
const TabCompTypeCounter = lazy(() => import("./tabs/TabCompType"));
const TabCompJobCounter = lazy(() => import("./tabs/TabCompJob"));
const TabCompTypeJobCounter = lazy(() => import("./tabs/TabCompTypeJob"));

// Define tabs using the reusable format
const tabs: ReusableTabItem[] = [
  { label: "Component", icon: <AccountTree />, component: TabCompUnitCounter },
  { label: "CompType", icon: <BarChart />, component: TabCompTypeCounter },
  { label: "CompJob", icon: <ContentCopy />, component: TabCompJobCounter },
  {
    label: "CompTypeJob",
    icon: <EditNoteIcon />,
    component: TabCompTypeJobCounter,
  },
];

type Props = {
  counterTypeId?: number | undefined | null;
  label?: string | null;
};

const CounterTypeTabs = ({ counterTypeId, label }: Props) => {
  return (
    <TabsContainer
      tabs={tabs}
      tabProps={{ counterTypeId: counterTypeId, label: label }}
    />
  );
};

export default CounterTypeTabs;
