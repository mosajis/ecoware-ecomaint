import React from "react";
import { Box, Grid, Paper, Typography, Divider } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip as ReTooltip, Legend } from "recharts";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";

// ✅ Mock Data
const kpiData = [
  { label: "Open WO", value: 14 },
  { label: "Failures", value: 6 },
  { label: "MTTR (hrs)", value: 3.2 },
  { label: "MTBF (hrs)", value: 39 },
];

const workOrderStatusData = [
  { name: "Open", value: 10 },
  { name: "In Progress", value: 5 },
  { name: "Done", value: 18 },
  { name: "Pending", value: 3 },
];

const criticalEquipments = [
  { id: 1, code: "CMP-001", name: "Compressor A", failures: 8, downtime: 42 },
  { id: 2, code: "PMP-122", name: "Pump 122", failures: 5, downtime: 21 },
];

const pmSchedule = [
  {
    id: 1,
    job: "PM-1001",
    comp: "Compressor",
    due: "2025-11-14",
    delay: 3,
    discipline: "Mechanical",
  },
  {
    id: 2,
    job: "PM-1007",
    comp: "Pump",
    due: "2025-11-12",
    delay: -1,
    discipline: "Electrical",
  },
];

// ✅ Columns
const criticalCols = [
  { field: "code", headerName: "Code", flex: 1 },
  { field: "name", headerName: "Name", flex: 2 },
  { field: "failures", headerName: "Failures", flex: 1 },
  { field: "downtime", headerName: "Downtime (hrs)", flex: 1 },
];

const pmColumns = [
  { field: "job", headerName: "Job", flex: 1 },
  { field: "comp", headerName: "Component", flex: 2 },
  { field: "due", headerName: "Due Date", flex: 1 },
  {
    field: "delay",
    headerName: "Delay",
    flex: 1,
    renderCell: ({ value }) => (
      <span style={{ color: value > 0 ? "red" : "inherit" }}>{value}</span>
    ),
  },
  { field: "discipline", headerName: "Discipline", flex: 1 },
];

export default function MaintenanceDashboard() {
  return (
    <Box padding={2} display="flex" flexDirection="column" gap={2}>
      {/* ✅ KPI Cards */}
      <Grid container spacing={2}>
        {kpiData.map((kpi) => (
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h6">{kpi.label}</Typography>
            <Typography variant="h4" fontWeight="bold">
              {kpi.value}
            </Typography>
          </Paper>
        ))}
      </Grid>

      <Box display={"flex"}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Work Order Status</Typography>
          <PieChart width={300} height={240}>
            <Pie
              data={workOrderStatusData}
              dataKey="value"
              nameKey="name"
              label
              outerRadius={80}
            >
              {workOrderStatusData.map((_, idx) => (
                <Cell key={idx} />
              ))}
            </Pie>
            <ReTooltip />
            <Legend />
          </PieChart>
        </Paper>

        {/* Right: Critical Equipments */}
        <CustomizedDataGrid
          rows={criticalEquipments}
          columns={criticalCols}
          onRefreshClick={() => console.log("refresh critical")}
        />
      </Box>

      <Divider />

      {/* ✅ PM Schedule */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" mb={1}>
          PM Schedule
        </Typography>
        <CustomizedDataGrid
          rows={pmSchedule}
          columns={pmColumns}
          onRefreshClick={() => console.log("refresh PM")}
        />
      </Paper>
    </Box>
  );
}
