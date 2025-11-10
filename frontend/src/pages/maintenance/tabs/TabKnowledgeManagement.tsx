import React from "react";
import {Box, Button, Stack} from "@mui/material";
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

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Stack direction="row" spacing={1} mb={1} flexWrap="wrap">
        <Button variant="contained" size="small">New</Button>
        <Button variant="outlined" size="small">Edit</Button>
        <Button variant="outlined" size="small">View</Button>
        <Button variant="outlined" color="error" size="small">Delete</Button>
        <Button variant="outlined" size="small">Refresh</Button>
        <Button variant="outlined" size="small">Print</Button>
        <Button variant="outlined" size="small">Submit</Button>
      </Stack>

      <CustomizedDataGrid
        style={{ flex: 1 }}
        label="Knowledge Management"
        rows={rows}
        columns={columns}
      />
    </Box>
  );
};

export default TabKnowledgeManagement;
