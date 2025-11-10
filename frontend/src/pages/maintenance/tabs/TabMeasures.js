import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Button, Stack } from "@mui/material";
import CustomizedDataGrid from "@/shared/components/DataGrid"; // مسیرت رو درست کن
const TabMeasures = () => {
    const columns = [
        { field: "measureName", headerName: "Measure Name", flex: 1 },
        { field: "unitName", headerName: "Unit Name", flex: 1 },
        { field: "unitDescription", headerName: "Unit Description", flex: 1 },
        { field: "setValue", headerName: "Set Value", flex: 1 },
        { field: "operationalMainValue", headerName: "Operational Main Value", flex: 1 },
        { field: "createDate", headerName: "Create Date", flex: 1 },
        { field: "currentValue", headerName: "Current Value", flex: 1 },
        { field: "orderId", headerName: "Order ID", flex: 1 },
    ];
    const rows = [
        {
            id: "1",
            measureName: "Temperature",
            unitName: "Celsius",
            unitDescription: "Temperature in Celsius",
            setValue: 25,
            operationalMainValue: 22,
            createDate: "2025-11-01",
            currentValue: 23,
            orderId: "ORD123",
        },
    ];
    return (_jsxs(Box, { display: "flex", flexDirection: "column", height: "100%", children: [_jsxs(Stack, { direction: "row", spacing: 1, mb: 1, flexWrap: "wrap", children: [_jsx(Button, { variant: "contained", size: "small", children: "Add" }), _jsx(Button, { variant: "outlined", size: "small", children: "Edit" }), _jsx(Button, { variant: "outlined", size: "small", color: "error", children: "Delete" }), _jsx(Button, { variant: "outlined", size: "small", children: "Trend" }), _jsx(Button, { variant: "outlined", size: "small", children: "Set Measure" }), _jsx(Button, { variant: "outlined", size: "small", children: "Edit Measure" })] }), _jsx(CustomizedDataGrid, { style: { flex: 1 }, label: "Measures", rows: rows, columns: columns })] }));
};
export default TabMeasures;
