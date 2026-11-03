import { GridColDef } from "@mui/x-data-grid";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CellDateTime from "@/shared/components/dataGrid/cells/CellDateTime";
import { CounterAlert } from "./TabCounterAlertType";

export const getRowId = (row: CounterAlert) =>
  `${row.info.jobDescTitle}-${row.start.lastDone}`;

const calculateProgress = (
  start: number | null | undefined,
  current: number | null | undefined,
  end: number | null | undefined,
) => {
  if (start == null || current == null || end == null) {
    return 0;
  }

  const total = end - start;
  const progress = current - start;

  if (total <= 0) {
    return 100;
  }

  return Math.min(Math.max((progress / total) * 100, 0), 100);
};

export const columns: GridColDef<CounterAlert>[] = [
  {
    field: "componentName",
    headerName: "Component",
    flex: 1,
    valueGetter: (_, row) => row.info.componentName ?? "--",
  },
  {
    field: "jobDescTitle",
    headerName: "Job Description",
    flex: 1,
    valueGetter: (_, row) => row.info.jobDescTitle,
  },
  {
    field: "progress",
    headerName: "Progress",
    flex: 1,
    sortable: false,
    renderCell: ({ row }) => {
      const value = calculateProgress(
        row.start.lastDoneCount,
        row.value.currentValue,
        row.end.nextDueCount,
      );

      return (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <LinearProgress
            variant="determinate"
            value={value}
            color={row.info.status ? "success" : "error"}
            sx={{
              background: "#eee",
              flex: 1,
              height: 6,
              borderRadius: 5,
            }}
          />

          <Typography variant="caption">{Math.round(value)}%</Typography>
        </Box>
      );
    },
  },
  {
    field: "lastDoneCount",
    headerName: "Last Done",
    width: 120,
    valueGetter: (_, row) => row.start.lastDoneCount,
  },
  {
    field: "currentValue",
    headerName: "Current",
    width: 120,
    valueGetter: (_, row) => row.value.currentValue,
  },
  {
    field: "nextDueCount",
    headerName: "Next Due",
    width: 120,
    valueGetter: (_, row) => row.end.nextDueCount,
  },
  {
    field: "frequency",
    headerName: "Frequency",
    width: 110,
    valueGetter: (_, row) => row.info.frequency ?? "--",
  },
  {
    field: "lastDoneDate",
    headerName: "Last Done Date",
    width: 140,
    renderCell: ({ row }) => (
      <CellDateTime value={row.start.lastDone} type="DATE" />
    ),
  },
  {
    field: "currentDate",
    headerName: "Current Date",
    width: 140,
    renderCell: ({ row }) => (
      <CellDateTime value={row.value.currentDate} type="DATE" />
    ),
  },
  {
    field: "nextDueDate",
    headerName: "Next Due Date",
    width: 140,
    renderCell: ({ row }) => (
      <CellDateTime value={row.end.nextDueDate} type="DATE" />
    ),
  },
];
