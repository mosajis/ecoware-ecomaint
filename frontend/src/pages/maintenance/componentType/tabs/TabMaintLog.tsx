import React from "react";
import { Box, Button, Stack } from "@mui/material";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid"; // مسیرت رو درست کن

const TabMaintLog = () => {
  const columns = [
    { field: "component", headerName: "Component", flex: 1 },
    { field: "jobCode", headerName: "Job Code", flex: 1 },
    { field: "jobName", headerName: "Job Name", flex: 1 },
    { field: "dateDone", headerName: "Date Done", flex: 1 },
    { field: "discipline", headerName: "Discipline", flex: 1 },
    { field: "reportedBy", headerName: "Reported By", flex: 1 },
    { field: "followStatus", headerName: "Follow Status", flex: 1 },
    {
      field: "currentUserFollowStatus",
      headerName: "Current User Follow Status",
      flex: 1,
    },
    { field: "followCount", headerName: "Follow Count", flex: 1 },
    { field: "follower", headerName: "Follower", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    { field: "stockUsed", headerName: "Stock Used", flex: 1 },
    { field: "empHrs", headerName: "Emp/Hrs", flex: 1 },
    { field: "maintClass", headerName: "Maint Class", flex: 1 },
    { field: "totalAttach", headerName: "Total Attach", flex: 1 },
    { field: "totalMessage", headerName: "Total Message", flex: 1 },
    { field: "downTime", headerName: "DownTime (Min)", flex: 1 },
    {
      field: "componentStatusName",
      headerName: "Component Status Name",
      flex: 1,
    },
    { field: "isCritical", headerName: "Is Critical", flex: 1 },
    { field: "unplanned", headerName: "Unplanned", flex: 1 },
  ];

  const rows = [
    {
      id: "1",
      component: "Pump A",
      jobCode: "J001",
      jobName: "Inspection",
      dateDone: "2025-11-01",
      discipline: "Mechanical",
      reportedBy: "John Doe",
      followStatus: "In Progress",
      currentUserFollowStatus: "Pending",
      followCount: 3,
      follower: "Jane Smith",
      status: "Open",
      stockUsed: "Yes",
      empHrs: 5,
      maintClass: "Routine",
      totalAttach: 2,
      totalMessage: 4,
      downTime: 30,
      componentStatusName: "Operational",
      isCritical: "Yes",
      unplanned: "No",
    },
  ];

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Stack direction="row" spacing={1} mb={1} flexWrap="wrap">
        {[
          "Filter",
          "Custom Filter",
          "Follow Up",
          "Reviewed",
          "Notes",
          "History",
          "Attachments",
          "Stock Print",
          "Log Control",
          "Request",
          "Forward",
          "Analysis",
          "Sample Oil",
          "Recheck",
        ].map((label) => (
          <Button key={label} variant="outlined" size="small">
            {label}
          </Button>
        ))}
      </Stack>

      <CustomizedDataGrid
        style={{ flex: 1 }}
        label="Maintenance Log"
        rows={rows}
        columns={columns}
      />
    </Box>
  );
};

export default TabMaintLog;
