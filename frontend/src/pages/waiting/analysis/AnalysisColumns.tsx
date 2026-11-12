import { TypeWaitingAnalysis } from "@/core/api/api";
import CellDateTime from "@/shared/components/dataGrid/cells/CellDateTime";
import type { GridColDef } from "@mui/x-data-grid";

type WaitingEvent = TypeWaitingAnalysis["topEvents"][number];

export const getRowId = (row: WaitingEvent) => row.waitingEventId;

export const columns: GridColDef<WaitingEvent>[] = [
  {
    field: "eventCode",
    headerName: "Code",
    flex: 0.8,
    minWidth: 100,
    valueGetter: (_, row) => row.eventCode ?? "-",
  },
  {
    field: "startDateTime",
    headerName: "Start",
    flex: 1.2,
    minWidth: 160,
    renderCell: ({ value }) => <CellDateTime value={value} />,
  },
  {
    field: "endDateTime",
    headerName: "End",
    flex: 1.2,
    minWidth: 160,
    renderCell: ({ value }) => <CellDateTime value={value} />,
  },
  {
    field: "reason",
    headerName: "Reason",
    flex: 1.5,
    minWidth: 180,
    valueGetter: (_, row) => row.reason?.nameEn ?? "-",
  },
  {
    field: "operationPhase",
    headerName: "Phase",
    flex: 1,
    minWidth: 140,
    valueGetter: (_, row) => row.operationPhase ?? "-",
  },
  {
    field: "nptClass",
    headerName: "NPT Class",
    flex: 1,
    minWidth: 140,
    valueGetter: (_, row) => row.nptClass ?? "-",
  },
  {
    field: "durationHours",
    headerName: "Duration",
    type: "number",

    minWidth: 110,
  },
];
