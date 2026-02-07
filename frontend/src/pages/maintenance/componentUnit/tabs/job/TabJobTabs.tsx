import EditNoteIcon from "@mui/icons-material/EditNote";
import LinkIcon from "@mui/icons-material/Link";
import BarChart from "@mui/icons-material/BarChart";
import { lazy } from "react";
import { TypeTblCompJob } from "@/core/api/generated/api";
import TabsContainer, {
  ReusableTabItem,
} from "@/shared/components/TabsContainer";

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
  { label: "Job Trigger", icon: <LinkIcon />, component: TabTrigger },
];

type Props = {
  compJob?: TypeTblCompJob | null;
};

const Tabs = ({ compJob }: Props) => {
  return (
    <TabsContainer tabs={tabs} persistInUrl={false} tabProps={{ compJob }} />
  );
};

export default Tabs;
