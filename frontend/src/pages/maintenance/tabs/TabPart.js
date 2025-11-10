import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Button, Stack } from "@mui/material";
import CustomizedDataGrid from "@/shared/components/DataGrid"; // مسیرت رو درست کن
const TabPart = () => {
    const columns = [
        { field: "partName", headerName: "Part Name", flex: 1 },
        { field: "makerRef", headerName: "Maker Ref", flex: 1 },
        { field: "partNo", headerName: "Part No", flex: 1 },
        { field: "extraNo", headerName: "Extra No", flex: 1 },
        { field: "notesDescription", headerName: "Notes Description", flex: 1 },
        { field: "farsiDescription", headerName: "Farsi Description", flex: 1 },
    ];
    const rows = [
        {
            id: "1",
            partName: "Gear A",
            makerRef: "Ref123",
            partNo: "P001",
            extraNo: "E001",
            notesDescription: "High-quality gear.",
            farsiDescription: "چرخ دنده با کیفیت بالا.",
        },
    ];
    return (_jsxs(Box, { display: "flex", flexDirection: "column", height: "100%", children: [_jsxs(Stack, { direction: "row", spacing: 1, mb: 1, children: [_jsx(Button, { variant: "contained", size: "small", children: "New" }), _jsx(Button, { variant: "outlined", size: "small", children: "Export" })] }), _jsx(CustomizedDataGrid, { style: { flex: 1 }, label: "Parts", rows: rows, columns: columns })] }));
};
export default TabPart;
