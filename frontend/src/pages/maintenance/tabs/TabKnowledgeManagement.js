import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Button, Stack } from "@mui/material";
import CustomizedDataGrid from "@/shared/components/DataGrid"; // مسیرت رو درست کن
const TabKnowledgeManagement = () => {
    const columns = [
        { field: "title", headerName: "Title", flex: 1 },
        { field: "keyword", headerName: "Keyword", flex: 1 },
        { field: "relatedTo", headerName: "Related To", flex: 1 },
        { field: "state", headerName: "State", flex: 1 },
        { field: "classType", headerName: "Class Type", flex: 1 },
        { field: "version", headerName: "Version", flex: 1 },
        { field: "creator", headerName: "Creator", flex: 1 },
        { field: "created", headerName: "Created", flex: 1 },
        { field: "approver", headerName: "Approver", flex: 1 },
        { field: "approved", headerName: "Approved", flex: 1 },
        { field: "score", headerName: "Score", flex: 1 },
    ];
    const rows = [
        {
            id: "1",
            title: "Knowledge Base A",
            keyword: "Maintenance",
            relatedTo: "Equipment",
            state: "Draft",
            classType: "Technical",
            version: "1.0",
            creator: "John Doe",
            created: "2025-10-01",
            approver: "Jane Smith",
            approved: "2025-10-15",
            score: 95,
        },
    ];
    return (_jsxs(Box, { display: "flex", flexDirection: "column", height: "100%", children: [_jsxs(Stack, { direction: "row", spacing: 1, mb: 1, flexWrap: "wrap", children: [_jsx(Button, { variant: "contained", size: "small", children: "New" }), _jsx(Button, { variant: "outlined", size: "small", children: "Edit" }), _jsx(Button, { variant: "outlined", size: "small", children: "View" }), _jsx(Button, { variant: "outlined", color: "error", size: "small", children: "Delete" }), _jsx(Button, { variant: "outlined", size: "small", children: "Refresh" }), _jsx(Button, { variant: "outlined", size: "small", children: "Print" }), _jsx(Button, { variant: "outlined", size: "small", children: "Submit" })] }), _jsx(CustomizedDataGrid, { style: { flex: 1 }, label: "Knowledge Management", rows: rows, columns: columns })] }));
};
export default TabKnowledgeManagement;
