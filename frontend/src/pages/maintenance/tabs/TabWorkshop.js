import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Button, Stack } from "@mui/material";
import CustomizedDataGrid from "@/shared/components/DataGrid"; // مسیرت رو درست کن
const TabWorkshop = () => {
    const columnsTable1 = [
        { field: "components", headerName: "Components", flex: 1 },
        { field: "location", headerName: "Location", flex: 1 },
        { field: "awardingDate", headerName: "Awarding Date", flex: 1 },
        { field: "jobOrderNo", headerName: "Job Order No", flex: 1 },
        { field: "department", headerName: "Department", flex: 1 },
        { field: "personInCharge", headerName: "Person in Charge", flex: 1 },
        { field: "pmEngineer", headerName: "PM Engineer", flex: 1 },
        { field: "bargeMaster", headerName: "Barge Master", flex: 1 },
        { field: "rigMaster", headerName: "Rig Master", flex: 1 },
        { field: "f54", headerName: "F54", flex: 1 },
    ];
    const dataTable1 = [
        {
            id: "1",
            components: "Component A",
            location: "Location 1",
            awardingDate: "2025-10-01",
            jobOrderNo: "JO123",
            department: "Mechanical",
            personInCharge: "John Doe",
            pmEngineer: "Jane Smith",
            bargeMaster: "Barge Master A",
            rigMaster: "Rig Master A",
            f54: "F54 Value",
        },
    ];
    const columnsTable2 = [
        { field: "awardingDate", headerName: "Awarding Date", flex: 1 },
        { field: "completedDate", headerName: "Completed Date", flex: 1 },
        { field: "personInCharge", headerName: "Person in Charge", flex: 1 },
        { field: "pmEngineer", headerName: "PM Engineer", flex: 1 },
        { field: "bargeMaster", headerName: "Barge Master", flex: 1 },
        { field: "rigMaster", headerName: "Rig Master", flex: 1 },
        { field: "personInChargeOnRig", headerName: "Person in Charge on Rig", flex: 1 },
    ];
    const dataTable2 = [
        {
            id: "1",
            awardingDate: "2025-10-01",
            completedDate: "2025-10-15",
            personInCharge: "John Doe",
            pmEngineer: "Jane Smith",
            bargeMaster: "Barge Master A",
            rigMaster: "Rig Master A",
            personInChargeOnRig: "Rig Person A",
        },
    ];
    return (_jsxs(Box, { display: "flex", flexDirection: "column", height: "100%", gap: 10, children: [_jsxs(Box, { children: [_jsx(Stack, { direction: "row", spacing: 1, mb: 1, flexWrap: "wrap", children: ["New", "Edit", "View", "Delete", "Print", "Export"].map((label) => (_jsx(Button, { variant: label === "New" ? "contained" : "outlined", size: "small", children: label }, label))) }), _jsx(CustomizedDataGrid, { style: { flex: 1, minHeight: 300 }, label: "Components Info", rows: dataTable1, columns: columnsTable1 })] }), _jsxs(Box, { children: [_jsx(Stack, { direction: "row", spacing: 1, mb: 1, flexWrap: "wrap", children: ["New", "Edit", "View", "Delete", "Print", "Export"].map((label) => (_jsx(Button, { variant: label === "New" ? "contained" : "outlined", size: "small", children: label }, label))) }), _jsx(CustomizedDataGrid, { style: { flex: 1, minHeight: 300 }, label: "Completion Info", rows: dataTable2, columns: columnsTable2 })] })] }));
};
export default TabWorkshop;
