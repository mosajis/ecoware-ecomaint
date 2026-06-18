import { Box, LinearProgress, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";

export const getRowId = (row: any) => row.installation;
export const columns: GridColDef[] = [
  {
    field: "installation",
    headerName: "Installation",
    flex: 1,
  },
  {
    field: "total",
    headerName: "Total WorkOrders",
    flex: 1,
  },
  {
    field: "open",
    headerName: "Open",
    flex: 1,
  },
  {
    field: "overdue",
    headerName: "Overdue",
    flex: 1,
  },
  {
    field: "completed",
    headerName: "Completed",
    flex: 1,
  },
  {
    field: "failureOpen",
    headerName: "Open Failure",
    flex: 1,
  },

  {
    field: "pmp",
    headerName: "PMP",
    flex: 1,
    valueGetter: (_, row) => row.pmp + "%",
  },
  {
    field: "pmc",
    headerName: "PMC",
    flex: 1,
    valueGetter: (_, row) => row.pmc + "%",
  },
];
