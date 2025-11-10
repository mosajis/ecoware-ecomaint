import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { lazy, Suspense, useEffect, useState } from "react";
import { Box, Button, Tab, Tabs } from "@mui/material";
import { useNavigate, useSearch } from "@tanstack/react-router";
import Spinner from "@/shared/components/Spinner";
import Splitter from "@/shared/components/Splitter";
import DataGridProAdapter from "@/shared/components/DataGrid"; // اگر DataGrid خودت داری عوض کن
// ---- Lazy Tabs ----
const TabWorkOrderInfo = lazy(() => import("@/pages/maintenance/tabs/TabWorkOrder"));
const TabPendingDetails = lazy(() => import("@/pages/maintenance/tabs/TabJobAttachment"));
const TabJobDescription = lazy(() => import("@/pages/maintenance/tabs/TabJobAttachment"));
const TabJobAttachments = lazy(() => import("@/pages/maintenance/tabs/TabJobAttachment"));
const TabWoAttachments = lazy(() => import("@/pages/maintenance/tabs/TabJobAttachment"));
const TabMaintenanceLog = lazy(() => import("@/pages/maintenance/tabs/TabJobAttachment"));
const TabComponentLog = lazy(() => import("@/pages/maintenance/tabs/TabJobAttachment"));
const TabSendReceive = lazy(() => import("@/pages/maintenance/tabs/TabJobAttachment"));
const TabMeasurePoints = lazy(() => import("@/pages/maintenance/tabs/TabMeasures"));
const TabRescheduleLog = lazy(() => import("@/pages/maintenance/tabs/TabJobAttachment"));
const TABS = [
    { label: "WorkOrder Info", Component: TabWorkOrderInfo },
    { label: "Pending Details", Component: TabPendingDetails },
    { label: "Job Description", Component: TabJobDescription },
    { label: "Job Attachments", Component: TabJobAttachments },
    { label: "WO Attachments", Component: TabWoAttachments },
    { label: "Maintenance Log", Component: TabMaintenanceLog },
    { label: "Component Log", Component: TabComponentLog },
    { label: "Send / Receive", Component: TabSendReceive },
    { label: "Measure Points", Component: TabMeasurePoints },
    { label: "Reschedule Log", Component: TabRescheduleLog },
];
const columns = [
    { field: "number", headerName: "Number", flex: 1 },
    { field: "jobCode", headerName: "Job Code", flex: 1 },
    { field: "component", headerName: "Component", flex: 1 },
    { field: "location", headerName: "Location", flex: 1 },
    { field: "jobDescTitle", headerName: "JobDescTitle", flex: 1 },
    { field: "disipline", headerName: "Disipline", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    { field: "dueDate", headerName: "Due Date", flex: 1 },
    { field: "completedDate", headerName: "Completed Date", flex: 1 },
    { field: "overDue", headerName: "OverDue", flex: 1 },
    { field: "pendingType", headerName: "Pending Type", flex: 1 },
    { field: "pendingDate", headerName: "Pending Date", flex: 1 },
    { field: "triggeredBy", headerName: "Triggered By", flex: 1 },
    { field: "componentStatus", headerName: "Component Status", flex: 1 },
    { field: "priority", headerName: "Priority", flex: 1 },
];
export default function WorkOrderPage() {
    const navigate = useNavigate({ from: '' });
    const searchTab = useSearch({
        strict: false,
        select: (s) => s.tab,
    });
    const [activeTab, setActiveTab] = useState(searchTab || TABS[0].label);
    useEffect(() => {
        if (searchTab && searchTab !== activeTab)
            setActiveTab(searchTab);
    }, [searchTab]);
    const handleChange = (_, newValue) => {
        setActiveTab(newValue);
        navigate({ search: () => ({ tab: newValue }) });
    };
    const ActiveComponent = TABS.find((t) => t.label === activeTab)?.Component;
    return (_jsxs(Box, { height: "100%", children: [_jsx(Tabs, { value: activeTab, onChange: handleChange, variant: "scrollable", scrollButtons: "auto", children: TABS.map((t) => (_jsx(Tab, { value: t.label, label: t.label }, t.label))) }), _jsxs(Splitter, { horizontal: true, initialPrimarySize: "55%", children: [_jsx(Box, { p: 1, sx: { overflow: "auto" }, children: _jsx(Suspense, { fallback: _jsx(Spinner, {}), children: ActiveComponent ? _jsx(ActiveComponent, {}) : null }) }), _jsxs(Box, { p: 1, display: "flex", flexDirection: "column", gap: 1, children: [_jsx(Box, { display: "flex", gap: 1, flexWrap: "wrap", children: ["Filter", "Custom Filter", "Issue", "Complete", "Pending", "Control", "Cancel", "Request", "Forward", "Re-Schedule", "HandOver"]
                                    .map(btn => _jsx(Button, { variant: "outlined", size: "small", children: btn }, btn)) }), _jsx(Box, { flexGrow: 1, minHeight: 0, children: _jsx(DataGridProAdapter, { rows: [], columns: columns }) })] })] })] }));
}
