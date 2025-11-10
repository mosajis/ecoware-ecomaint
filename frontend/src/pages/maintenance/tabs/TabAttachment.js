import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Button, Checkbox, FormControlLabel, Stack, TextField, } from "@mui/material";
import CustomizedDataGrid from "@/shared/components/DataGrid"; // مسیرت رو درست کن
const TabAttachment = () => {
    const columns = [
        { field: "fileName", headerName: "File Name", flex: 1 },
        { field: "description", headerName: "Description", flex: 1 },
        { field: "isExternalFile", headerName: "Is External File", flex: 1 },
        { field: "path", headerName: "Path", flex: 1 },
    ];
    const rows = [
        {
            id: "1",
            fileName: "example.pdf",
            description: "Sample file",
            isExternalFile: "No",
            path: "/files/example.pdf",
        },
    ];
    return (_jsxs(Box, { display: "flex", flexDirection: "column", height: "100%", gap: 2, children: [_jsxs(Box, { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2, children: [_jsx(TextField, { label: "File Name", size: "small", fullWidth: true }), _jsx(TextField, { label: "Description", size: "small", fullWidth: true }), _jsx(TextField, { label: "Path", size: "small", fullWidth: true }), _jsx(FormControlLabel, { control: _jsx(Checkbox, { size: "small" }), label: "Is External File" })] }), _jsxs(Stack, { direction: "row", spacing: 1, children: [_jsx(Button, { variant: "contained", size: "small", children: "Save" }), _jsx(Button, { variant: "outlined", size: "small", children: "New" }), _jsx(Button, { variant: "outlined", size: "small", children: "Select" }), _jsx(Button, { variant: "outlined", size: "small", color: "error", children: "Delete" })] }), _jsx(CustomizedDataGrid, { style: { flex: 1 }, label: "Attachments", rows: rows, columns: columns })] }));
};
export default TabAttachment;
