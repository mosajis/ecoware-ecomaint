import { jsx as _jsx } from "react/jsx-runtime";
import { Box } from "@mui/material";
import CustomizedDataGrid from "@/shared/components/DataGrid"; // مسیرت رو درست کن
const TabJobAttachment = () => {
    const columns = [
        { field: "title", headerName: "Title", flex: 1 },
        { field: "fileName", headerName: "File Name", flex: 1 },
        { field: "fileType", headerName: "File Type", flex: 1 },
        { field: "isExternal", headerName: "Is External", flex: 1 },
        { field: "attachRelation", headerName: "Attach Relation", flex: 1 },
        { field: "attachGroupName", headerName: "Attach Group Name", flex: 1 },
        { field: "attachSubGroupName", headerName: "Attach Sub Group Name", flex: 1 },
    ];
    const rows = [
        {
            id: "1",
            title: "Document A",
            fileName: "doc_a.pdf",
            fileType: "PDF",
            isExternal: "No",
            attachRelation: "Job Relation A",
            attachGroupName: "Group 1",
            attachSubGroupName: "Sub Group A",
        },
    ];
    return (_jsx(Box, { display: "flex", flexDirection: "column", height: "100%", children: _jsx(CustomizedDataGrid, { style: { flex: 1 }, label: "Job Attachment", rows: rows, columns: columns }) }));
};
export default TabJobAttachment;
