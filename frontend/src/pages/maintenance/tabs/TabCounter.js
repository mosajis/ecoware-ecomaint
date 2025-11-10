import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Button, Stack } from "@mui/material";
import CustomizedDataGrid from "@/shared/components/DataGrid"; // مسیرت رو درست کن
const TabCounter = () => {
    const columns = [
        { field: "counterType", headerName: "Counter Type", flex: 1 },
        { field: "currentValue", headerName: "Current Value", flex: 1 },
        { field: "averageCountRate", headerName: "Average Count Rate", flex: 1 },
        { field: "startValue", headerName: "Start Value", flex: 1 },
        { field: "useCalcAverage", headerName: "Use Calc Average", flex: 1 },
        { field: "currentDate", headerName: "Current Date", flex: 1 },
        { field: "startDate", headerName: "Start Date", flex: 1 },
        { field: "dependedOn", headerName: "Depended On", flex: 1 },
    ];
    const rows = [
        {
            id: "1",
            counterType: "Type A",
            currentValue: 100,
            averageCountRate: 5,
            startValue: 0,
            useCalcAverage: "Yes",
            currentDate: "2025-11-03",
            startDate: "2025-01-01",
            dependedOn: "None",
        },
    ];
    return (_jsxs(Box, { display: "flex", flexDirection: "column", height: "100%", children: [_jsxs(Stack, { direction: "row", spacing: 1, mb: 1, height: "fit-content", children: [_jsx(Button, { variant: "contained", size: "small", children: "New" }), _jsx(Button, { variant: "outlined", size: "small", children: "Set Counter" }), _jsx(Button, { variant: "outlined", size: "small", children: "Save" }), _jsx(Button, { variant: "outlined", color: "error", size: "small", children: "Delete" }), _jsx(Button, { variant: "outlined", size: "small", children: "Replace" })] }), _jsx(CustomizedDataGrid, { style: { flex: 1 }, label: "Counter", rows: rows, columns: columns })] }));
};
export default TabCounter;
