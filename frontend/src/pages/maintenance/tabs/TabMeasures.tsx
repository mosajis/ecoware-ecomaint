import React from "react";
import {Box, Button, Stack} from "@mui/material";
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

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Stack direction="row" spacing={1} mb={1} flexWrap="wrap">
        <Button variant="contained" size="small">Add</Button>
        <Button variant="outlined" size="small">Edit</Button>
        <Button variant="outlined" size="small" color="error">Delete</Button>
        <Button variant="outlined" size="small">Trend</Button>
        <Button variant="outlined" size="small">Set Measure</Button>
        <Button variant="outlined" size="small">Edit Measure</Button>
      </Stack>

      <CustomizedDataGrid
        style={{ flex: 1 }}
        label="Measures"
        rows={rows}
        columns={columns}
      />
    </Box>
  );
};

export default TabMeasures;
