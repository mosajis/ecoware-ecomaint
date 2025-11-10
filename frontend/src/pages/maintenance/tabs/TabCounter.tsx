import React from "react";
import { Box, Button, Stack } from "@mui/material";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid"; // مسیرت رو درست کن

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

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Stack direction="row" spacing={1} mb={1} height="fit-content">
        <Button variant="contained" size="small">
          New
        </Button>
        <Button variant="outlined" size="small">
          Set Counter
        </Button>
        <Button variant="outlined" size="small">
          Save
        </Button>
        <Button variant="outlined" color="error" size="small">
          Delete
        </Button>
        <Button variant="outlined" size="small">
          Replace
        </Button>
      </Stack>

      {/* DataGrid */}
      <CustomizedDataGrid
        style={{ flex: 1 }}
        label="Counter"
        rows={rows}
        columns={columns}
      />
    </Box>
  );
};

export default TabCounter;
