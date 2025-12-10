import { lazy } from "react";
import AccountTree from "@mui/icons-material/AccountTree";
import TabsContainer from "@/shared/components/TabsContainer";

// Lazy-loaded components
const TabJob = lazy(() => import("./tabs/TabJob"));

// Tabs definition
const tabs = [{ label: "Job", icon: <AccountTree />, component: TabJob }];

const TabsComponent = () => {
  return <TabsContainer tabs={tabs} queryParamKey="tab" />;
};

export default TabsComponent;
