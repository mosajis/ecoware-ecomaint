import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { lazy, Suspense, useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import Splitter from "@/shared/components/Splitter";
import DataGridProAdapter from "@/shared/components/DataGrid";
import Spinner from "@/shared/components/Spinner";
const TabRound = lazy(() => import("@/pages/maintenance/tabs/TabRound"));
const TabJobs = lazy(() => import("@/pages/maintenance/tabs/TabJob"));
const TABS = [
    { label: "Round", Component: TabRound },
    { label: "Jobs", Component: TabJobs },
];
const columns = [
    { field: "roundCode", headerName: "Round Code", flex: 1 },
    { field: "roundTitle", headerName: "Round Title", flex: 1 },
    { field: "description", headerName: "Description", flex: 1 },
    { field: "frequency", headerName: "Frequency", flex: 1 },
    { field: "disiplineName", headerName: "Disipline Name", flex: 1 },
    { field: "lastDone", headerName: "Last Done", flex: 1 },
    { field: "lastDueDate", headerName: "Last Due Date", flex: 1 },
    { field: "lastUpdated", headerName: "Last Updated", flex: 1 },
    { field: "totalJobs", headerName: "Total Jobs", flex: 1 },
    { field: "maintTypeDes", headerName: "Maint Type Des", flex: 1 },
    { field: "maintCauseDes", headerName: "Maint Cause Des", flex: 1 },
    { field: "maintClassDes", headerName: "Maint Class Des", flex: 1 },
    {
        field: "reportingMethodName",
        headerName: "Reporting Method Name",
        flex: 1,
    },
    { field: "planningMethodName", headerName: "Planning Method Name", flex: 1 },
];
export default function RoundPage() {
    const [activeTab, setActiveTab] = useState("Round");
    const ActiveComponent = TABS.find((t) => t.label === activeTab)?.Component;
    return (_jsxs(Splitter, { horizontal: true, initialPrimarySize: "50%", minPrimarySize: "200px", children: [_jsxs(Box, { display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", children: [_jsx(Tabs, { value: activeTab, onChange: (_, v) => setActiveTab(v), children: TABS.map((t) => (_jsx(Tab, { value: t.label, label: t.label }, t.label))) }), _jsx(Box, { flex: 1, p: 1, sx: { overflow: "auto" }, children: _jsx(Suspense, { fallback: _jsx(Spinner, {}), children: ActiveComponent ? _jsx(ActiveComponent, {}) : null }) })] }), _jsx(Box, { p: 1, children: _jsx(DataGridProAdapter, { rows: [], columns: columns }) })] }));
}
