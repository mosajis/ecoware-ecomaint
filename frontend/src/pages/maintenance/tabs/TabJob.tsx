import React from "react";
import { Box, Button, Stack } from "@mui/material";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid"; // مسیرت رو درست کن

const TabJob = () => {
  const columns = [
    { field: "jobCode", headerName: "Job Code", flex: 1 },
    { field: "jobTitle", headerName: "Job Title", flex: 1 },
    { field: "discipline", headerName: "Discipline", flex: 1 },
    { field: "frequency", headerName: "Frequency", flex: 1 },
    { field: "frequencyPeriod", headerName: "Frequency Period", flex: 1 },
    { field: "lastDone", headerName: "Last Done", flex: 1 },
    { field: "newDueDate", headerName: "New Due Date", flex: 1 },
    { field: "roundCode", headerName: "Round Code", flex: 1 },
    { field: "roundTitle", headerName: "Round Title", flex: 1 },
  ];

  const rows = [
    {
      id: "1",
      jobCode: "J001",
      jobTitle: "Inspection",
      discipline: "Mechanical",
      frequency: "Monthly",
      frequencyPeriod: "30 Days",
      lastDone: "2025-10-01",
      newDueDate: "2025-11-01",
      roundCode: "R001",
      roundTitle: "Routine Check",
    },
  ];

  return (
    <Box display={"flex"} height={"100%"} flexDirection={"column"}>
      <Stack direction="row" spacing={1} mb={1} height={"fit-content"}>
        <Button variant="contained" size={"small"}>
          New Job
        </Button>
        <Button variant="outlined" size={"small"}>
          Print Jobs
        </Button>
      </Stack>

      {/* DataGrid */}
      <CustomizedDataGrid
        style={{ flex: 1 }}
        label={"Job"}
        rows={rows}
        columns={columns}
      />
    </Box>
  );
};

export default TabJob;
