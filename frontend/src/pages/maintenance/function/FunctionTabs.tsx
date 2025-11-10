import {cloneElement, lazy, Suspense, useEffect, useState} from "react";
import {Box, Tab, Tabs} from "@mui/material";
import {useNavigate, useSearch} from "@tanstack/react-router";
import {
  AccountTree,
  Apps,
  AttachFile,
  BarChart,
  BugReport,
  ContentCopy,
  Description,
  DoneAll,
} from "@mui/icons-material";
import Spinner from "@/shared/components/Spinner"
import EditNoteIcon from '@mui/icons-material/EditNote';

// Lazy load tabs
const TabGeneral = lazy(() => import("@/pages/maintenance/tabs/TabGeneral"));
const TabDetails = lazy(() => import("@/pages/maintenance/tabs/TabDetails"));
const TabJob = lazy(() => import("@/pages/maintenance/tabs/TabJob"));
const TabCounter = lazy(() => import("@/pages/maintenance/tabs/TabCounter"));
const TabWorkOrder = lazy(() => import("@/pages/maintenance/tabs/TabWorkOrder"));
const TabMaintLog = lazy(() => import("@/pages/maintenance/tabs/TabMaintLog"));
const TabAttachment = lazy(() => import("@/pages/maintenance/tabs/TabAttachment"));
const TabJobAttachment = lazy(() => import("@/pages/maintenance/tabs/TabJobAttachment"));
const TabFailureReport = lazy(() => import("@/pages/maintenance/tabs/TabFailureReport"));
const TabPerformed = lazy(() => import("@/pages/maintenance/tabs/TabPerformed"));
const TabPart = lazy(() => import("@/pages/maintenance/tabs/TabPart"));
const TabMeasures = lazy(() => import("@/pages/maintenance/tabs/TabMeasures"));
const TabOilInfo = lazy(() => import("@/pages/maintenance/tabs/TabOilInfo"));
const TabStockUsed = lazy(() => import("@/pages/maintenance/tabs/TabStockUsed"));
const TabKnowledgeManagement = lazy(() => import("@/pages/maintenance/tabs/TabKnowledgeManagement"));
const TabWorkshop = lazy(() => import("@/pages/maintenance/tabs/TabWorkshop"));
const TabMaterialRequests = lazy(() => import("@/pages/maintenance/tabs/TabMaterialRequests"));

const ComponentUnitTabs = [
  { label: "General", icon: <Apps />, Component: TabGeneral },
  { label: "Details", icon: <Description />, Component: TabDetails },
  { label: "Job", icon: <AccountTree />, Component: TabJob },
  { label: "Counter", icon: <BarChart />, Component: TabCounter },
  { label: "Work Order", icon: <ContentCopy />, Component: TabWorkOrder },
  { label: "Maint Log", icon: <DoneAll />, Component: TabMaintLog },
  { label: "Attachment", icon: <AttachFile />, Component: TabAttachment },
  { label: "Failure Report", icon: <BugReport />, Component: TabFailureReport },
  { label: "Rotation Log", icon: <EditNoteIcon /> },
];

const TabsComponent = () => {
  const navigate = useNavigate({from : ""});

  // خواندن query param tab از URL
  const searchTab = useSearch({
    strict: false, // اجازه می‌دهد هر query param بیاید
    select: (search) => search.tab as string | undefined,
  });

  // تب فعال: اگر query param نبود تب اول
  const [activeTab, setActiveTab] = useState<string>(
    searchTab || ComponentUnitTabs[0].label
  );

  // اگر query param تغییر کرد، تب هم آپدیت شود
  useEffect(() => {
    if (searchTab && searchTab !== activeTab) {
      setActiveTab(searchTab);
    }
  }, [searchTab]);

  const handleChange = (_: any, newValue: string) => {
    setActiveTab(newValue);
    navigate({ search: { tab: newValue} }); // تغییر query param
  };

  const ActiveComponent = ComponentUnitTabs.find((t) => t.label === activeTab)?.Component;

  return (
    <Box height="100%">
      <Tabs
        value={activeTab}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
      >
        {ComponentUnitTabs.map((tab) => (
          <Tab
            key={tab.label}
            value={tab.label}
            icon={cloneElement(tab.icon, { sx: { fontSize: 17 } })}
            label={tab.label}
            iconPosition="start"
          />
        ))}
      </Tabs>

      <Box
        sx={(theme) => ({
          padding: ".5rem",
          paddingTop: ".7rem",
          border: `1px solid ${(theme.vars || theme).palette.divider}`,
          borderTop: 0,
          borderRadius: "0 0 8px 8px",
          height: "calc(100% - 43px)",
          overflowY: "scroll",
        })}
      >
        {ActiveComponent && (
          <Suspense fallback={<Spinner />}>
            <ActiveComponent />
          </Suspense>
        )}
      </Box>
    </Box>
  );
};

export default TabsComponent;
