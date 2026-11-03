import BarChart from "@mui/icons-material/BarChart";
import Description from "@mui/icons-material/Description";

import { lazy } from "react";
import TabsContainer, {
  ReusableTabItem,
} from "@/shared/components/TabsContainer";

// Lazy imports
const TabCounterAlert = lazy(() => import("./tabs/TabCounterAlert"));
const TabCounterAlertCard = lazy(() => import("./tabs/TabCounterAlertCard"));

type Props = {
  counterAlerts?: any | undefined | null;
  label?: string | null;
};

// Define tabs
const tabs: ReusableTabItem[] = [
  { label: "List View", icon: <Description />, component: TabCounterAlert },
  { label: "Card View", icon: <BarChart />, component: TabCounterAlertCard },
];

const CounterAlertTabs = (props: Props) => {
  const { label, counterAlerts } = props;

  return (
    <TabsContainer
      tabs={tabs}
      tabProps={{
        label,
        counterAlerts,
      }}
    />
  );
};

export default CounterAlertTabs;
