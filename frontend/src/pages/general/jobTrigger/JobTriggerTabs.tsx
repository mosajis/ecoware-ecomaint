import Build from "@mui/icons-material/Build";

import TabsContainer, {
  type ReusableTabItem,
} from "@/shared/components/TabsContainer";

import { lazy } from "react";

// Lazy-loaded tab components
const TabComponentJob = lazy(() => import("./tabs/TabComponentJob"));

// Define tabs in reusable format
const tabs: ReusableTabItem[] = [
  {
    label: "Component Job",
    icon: <Build />,
    component: TabComponentJob,
  },
];

type Props = {
  jobTriggerId?: number | undefined | null;
  label?: string | null;
};

export function Tabs(props: Props) {
  const { jobTriggerId, label } = props;
  return <TabsContainer tabs={tabs} tabProps={{ jobTriggerId, label }} />;
}
