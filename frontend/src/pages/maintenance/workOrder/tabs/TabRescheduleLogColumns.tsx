import { TypeTblReScheduleLog } from "@/core/api/generated/api";
import CellDateTime from "@/shared/components/dataGrid/cells/CellDateTime";
import CellFullName from "@/shared/components/dataGrid/cells/CellFullName";
import { GridColDef } from "@mui/x-data-grid";

export const getRowId = (row: TypeTblReScheduleLog) => row.rescheduleLogId;

// === Columns ===
export const columns: GridColDef<TypeTblReScheduleLog>[] = [
  {
    field: "fromDueDate",
    headerName: "From DueDate",
    width: 120,
    renderCell: ({ value }) => <CellDateTime value={value} type="DATE" />,
  },
  {
    field: "toDueDate",
    headerName: "To DueDate",
    width: 120,

    renderCell: ({ value }) => <CellDateTime value={value} type="DATE" />,
  },
  {
    field: "rescheduledDate",
    headerName: "ReSchedule Date",
    width: 140,

    renderCell: ({ value }) => <CellDateTime value={value} type="DATE" />,
  },
  {
    field: "rescheduledBy",
    headerName: "ReScheduled By",
    flex: 1,
    valueGetter: (_, row) => row.tblEmployee,
    renderCell: ({ value }) => <CellFullName value={value} />,
  },
];
