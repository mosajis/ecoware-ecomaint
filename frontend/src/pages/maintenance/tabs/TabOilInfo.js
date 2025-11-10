import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Button, Stack } from "@mui/material";
import CustomizedDataGrid from "@/shared/components/DataGrid"; // مسیرت رو درست کن
const TabOilInfo = () => {
    const columns = [
        { field: "compNo", headerName: "Comp No", flex: 1 },
        { field: "typeName", headerName: "Type Name", flex: 1 },
        { field: "jobDescCode", headerName: "Job Desc Code", flex: 1 },
        { field: "jobDescTitle", headerName: "Job Desc Title", flex: 1 },
        { field: "partName", headerName: "Part Name", flex: 1 },
        { field: "counterTypeName", headerName: "Counter Type Name", flex: 1 },
        { field: "loggedBy", headerName: "Logged By", flex: 1 },
        { field: "tankCapacity", headerName: "Tank Capacity", flex: 1 },
        { field: "laboratoryCode", headerName: "Laboratory Code", flex: 1 },
        { field: "samplingPosition", headerName: "Sampling Position", flex: 1 },
        { field: "oilGrade", headerName: "Oil Grade", flex: 1 },
    ];
    const rows = [
        {
            id: "1",
            compNo: "C001",
            typeName: "Hydraulic",
            jobDescCode: "JD001",
            jobDescTitle: "Oil Change",
            partName: "Filter A",
            counterTypeName: "Hours",
            loggedBy: "John Doe",
            tankCapacity: "500L",
            laboratoryCode: "LAB123",
            samplingPosition: "Top",
            oilGrade: "Grade A",
        },
    ];
    return (_jsxs(Box, { display: "flex", flexDirection: "column", height: "100%", children: [_jsxs(Stack, { direction: "row", spacing: 1, mb: 1, children: [_jsx(Button, { variant: "contained", size: "small", children: "Add" }), _jsx(Button, { variant: "outlined", size: "small", children: "Edit History" })] }), _jsx(CustomizedDataGrid, { style: { flex: 1 }, label: "Oil Info", rows: rows, columns: columns })] }));
};
export default TabOilInfo;
