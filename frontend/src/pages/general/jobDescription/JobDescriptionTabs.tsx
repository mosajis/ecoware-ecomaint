import { lazy } from "react";
import TabsContainer, {
  type ReusableTabItem,
} from "@/shared/components/TabsContainer";
import {
  AttachFile,
  Build,
  CheckCircle,
  Tune,
  AddBox,
} from "@mui/icons-material";

// Lazy-loaded tab components
const TabMaintLog = lazy(() => import("./tabs/TabMaintLog"));
const TabAttachment = lazy(() => import("./tabs/TabAttachment"));
const TabComponentUnit = lazy(() => import("./tabs/TabComponentUnit"));
const TabTriggers = lazy(() => import("./tabs/TabTriggers"));
const TabRevision = lazy(() => import("./tabs/TabRevision"));

// Define tabs in reusable format
const JobDescTabs: ReusableTabItem[] = [
  { label: "MaintLog", icon: <CheckCircle />, component: TabMaintLog },
  { label: "Attachment", icon: <AttachFile />, component: TabAttachment },
  { label: "Component Unit", icon: <Build />, component: TabComponentUnit },
  { label: "Triggers", icon: <Tune />, component: TabTriggers },
  { label: "Revision", icon: <AddBox />, component: TabRevision },
];

export function JobDescriptionTabs() {
  return <TabsContainer tabs={JobDescTabs} queryParamKey="tab" />;
}
