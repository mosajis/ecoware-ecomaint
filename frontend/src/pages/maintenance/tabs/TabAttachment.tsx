import React from "react";
import {Box, Button, Checkbox, FormControlLabel, Stack, TextField,} from "@mui/material";
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

  return (
    <Box display="flex" flexDirection="column" height="100%" gap={2}>
      {/* Form */}
      <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2}>
        <TextField label="File Name" size="small" fullWidth />
        <TextField label="Description" size="small" fullWidth />
        <TextField label="Path" size="small" fullWidth />
        <FormControlLabel control={<Checkbox size="small" />} label="Is External File" />
      </Box>

      {/* Form Buttons */}
      <Stack direction="row" spacing={1}>
        <Button variant="contained" size="small">Save</Button>
        <Button variant="outlined" size="small">New</Button>
        <Button variant="outlined" size="small">Select</Button>
        <Button variant="outlined" size="small" color="error">Delete</Button>
      </Stack>

      {/* DataGrid */}
      <CustomizedDataGrid
        style={{ flex: 1 }}
        label="Attachments"
        rows={rows}
        columns={columns}
      />
    </Box>
  );
};

export default TabAttachment;
