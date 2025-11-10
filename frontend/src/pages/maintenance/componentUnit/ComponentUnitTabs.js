import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cloneElement, lazy, Suspense, useEffect, useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { AccountTree, AddBox, Apps, AttachFile, BarChart, Book, BugReport, Build, CheckCircle, ColorLens, ContentCopy, Description, DirectionsCar, DoneAll, Inbox, StackedLineChart, Tune, } from "@mui/icons-material";
import Spinner from "@/shared/components/Spinner";
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
    { label: "General", icon: _jsx(Apps, {}), Component: TabGeneral },
    { label: "Details", icon: _jsx(Description, {}), Component: TabDetails },
    { label: "Job", icon: _jsx(AccountTree, {}), Component: TabJob },
    { label: "Counter", icon: _jsx(BarChart, {}), Component: TabCounter },
    { label: "Work Order", icon: _jsx(ContentCopy, {}), Component: TabWorkOrder },
    { label: "Maint Log", icon: _jsx(DoneAll, {}), Component: TabMaintLog },
    { label: "Attachment", icon: _jsx(AttachFile, {}), Component: TabAttachment },
    { label: "Job Attachment", icon: _jsx(AddBox, {}), Component: TabJobAttachment },
    { label: "Failure Report", icon: _jsx(BugReport, {}), Component: TabFailureReport },
    { label: "Performed", icon: _jsx(CheckCircle, {}), Component: TabPerformed },
    { label: "Part", icon: _jsx(Build, {}), Component: TabPart },
    { label: "Measures", icon: _jsx(Tune, {}), Component: TabMeasures },
    { label: "Oil Info", icon: _jsx(ColorLens, {}), Component: TabOilInfo },
    { label: "Stock Used", icon: _jsx(StackedLineChart, {}), Component: TabStockUsed },
    { label: "Knowledge", icon: _jsx(Book, {}), Component: TabKnowledgeManagement },
    { label: "Workshop", icon: _jsx(DirectionsCar, {}), Component: TabWorkshop },
    { label: "Material Requests", icon: _jsx(Inbox, {}), Component: TabMaterialRequests },
];
const TabsComponent = () => {
    const navigate = useNavigate({ from: "" });
    // خواندن query param tab از URL
    const searchTab = useSearch({
        strict: false, // اجازه می‌دهد هر query param بیاید
        select: (search) => search.tab,
    });
    // تب فعال: اگر query param نبود تب اول
    const [activeTab, setActiveTab] = useState(searchTab || ComponentUnitTabs[0].label);
    // اگر query param تغییر کرد، تب هم آپدیت شود
    useEffect(() => {
        if (searchTab && searchTab !== activeTab) {
            setActiveTab(searchTab);
        }
    }, [searchTab]);
    const handleChange = (_, newValue) => {
        setActiveTab(newValue);
        navigate({ search: { tab: newValue } }); // تغییر query param
    };
    const ActiveComponent = ComponentUnitTabs.find((t) => t.label === activeTab)?.Component;
    return (_jsxs(Box, { height: "100%", children: [_jsx(Tabs, { value: activeTab, onChange: handleChange, variant: "scrollable", scrollButtons: "auto", allowScrollButtonsMobile: true, children: ComponentUnitTabs.map((tab) => (_jsx(Tab, { value: tab.label, icon: cloneElement(tab.icon, { sx: { fontSize: 17 } }), label: tab.label, iconPosition: "start" }, tab.label))) }), _jsx(Box, { sx: (theme) => ({
                    padding: ".5rem",
                    paddingTop: ".7rem",
                    border: `1px solid ${(theme.vars || theme).palette.divider}`,
                    borderTop: 0,
                    borderRadius: "0 0 8px 8px",
                    height: "calc(100% - 43px)",
                    overflowY: "scroll",
                }), children: ActiveComponent && (_jsx(Suspense, { fallback: _jsx(Spinner, {}), children: _jsx(ActiveComponent, {}) })) })] }));
};
export default TabsComponent;
