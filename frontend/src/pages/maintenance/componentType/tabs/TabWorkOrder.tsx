import React from "react";
import { Box } from "@mui/material";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid"; // مسیرت رو درست کن

const TabWorkOrder = () => {
  const columns = [
    { field: "number", headerName: "Number", flex: 1 },
    { field: "jobCode", headerName: "Job Code", flex: 1 },
    { field: "component", headerName: "Component", flex: 1 },
    { field: "location", headerName: "Location", flex: 1 },
    { field: "jobDescTitle", headerName: "Job Desc Title", flex: 1 },
    { field: "discipline", headerName: "Discipline", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    { field: "dueDate", headerName: "Due Date", flex: 1 },
    { field: "completedDate", headerName: "Completed Date", flex: 1 },
    { field: "overDue", headerName: "Over Due", flex: 1 },
    { field: "pendingType", headerName: "Pending Type", flex: 1 },
    { field: "pendingDate", headerName: "Pending Date", flex: 1 },
    { field: "triggeredBy", headerName: "Triggered By", flex: 1 },
    {
      field: "componentStatusName",
      headerName: "Component Status Name",
      flex: 1,
    },
    { field: "priority", headerName: "Priority", flex: 1 },
    { field: "pendingBy", headerName: "Pending By", flex: 1 },
  ];

  const rows = [
    {
      id: "1",
      number: 1,
      jobCode: "J001",
      component: "Pump A",
      location: "Building 1",
      jobDescTitle: "Inspection",
      discipline: "Mechanical",
      status: "Open",
      dueDate: "2025-11-10",
      completedDate: "",
      overDue: "No",
      pendingType: "Approval",
      pendingDate: "2025-11-01",
      triggeredBy: "System",
      componentStatusName: "Operational",
      priority: "High",
      pendingBy: "Manager",
    },
  ];

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <CustomizedDataGrid
        style={{ flex: 1 }}
        label="Work Order"
        rows={rows}
        columns={columns}
      />
    </Box>
  );
};

export default TabWorkOrder;
