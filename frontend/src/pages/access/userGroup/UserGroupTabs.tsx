import AccountTree from "@mui/icons-material/AccountTree";
import TabsContainer, {
  ReusableTabItem,
} from "@/shared/components/TabsContainer";
import { lazy, memo } from "react";

// Lazy imports
const TabGeneral = lazy(() => import("./tabs/TabGeneral"));
const TabAccessElement = lazy(() => import("./tabs/TabAccessElement"));
const TabAccessInstalltion = lazy(() => import("./tabs/TabAccessInstallation"));

// Tabs
const tabs: ReusableTabItem[] = [
  { label: "General", icon: <AccountTree />, component: TabGeneral },
  { label: "Rig Access", icon: <AccountTree />, component: TabAccessElement },
  {
    label: "Element Access",
    icon: <AccountTree />,
    component: TabAccessInstalltion,
  },
];

type Props = {};

const TabsComponent = () => {
  return (
    <TabsContainer
      tabs={tabs}
      //   tabProps={tabProps}
      persistInUrl={false}
    />
  );
};

export default memo(TabsComponent);
