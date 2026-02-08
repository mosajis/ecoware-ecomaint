import EditNoteIcon from "@mui/icons-material/EditNote";
import BarChart from "@mui/icons-material/BarChart";
import LinkIcon from "@mui/icons-material/Link";
import TabsContainer, {
  ReusableTabItem,
} from "@/shared/components/TabsContainer";
import { lazy } from "react";
import { TypeTblCompTypeJob } from "@/core/api/generated/api";

// Lazy imports
const TabCounter = lazy(() => import("./tabs/TabCounter"));
const TabMeasures = lazy(() => import("./tabs/TabMasures"));
const TabTrigger = lazy(() => import("./tabs/TabTrigger"));
const TabJobDescription = lazy(() => import("./tabs/TabJobDescription"));

// Define tabs using the reusable format
const tabs: ReusableTabItem[] = [
  {
    label: "Job Description",
    icon: <BarChart />,
    component: TabJobDescription,
  },

  { label: "Job Counter", icon: <BarChart />, component: TabCounter },
  {
    label: "Job Measure Points",
    icon: <EditNoteIcon />,
    component: TabMeasures,
  },
  {
    label: "Job Trigger",
    icon: <LinkIcon />,
    component: TabTrigger,
  },
];

type Props = {
  compTypeJob?: TypeTblCompTypeJob;
};

const Tabs = ({ compTypeJob }: Props) => {
  return (
    <TabsContainer
      tabs={tabs}
      persistInUrl={false}
      tabProps={{ compTypeJob }}
    />
  );
};

export default Tabs;
