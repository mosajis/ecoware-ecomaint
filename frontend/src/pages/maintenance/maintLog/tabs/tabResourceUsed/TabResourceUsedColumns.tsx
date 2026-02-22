import { TypeTblLogDiscipline } from "@/core/api/generated/api";
import { GridColDef } from "@mui/x-data-grid";

// === Columns ===
export const getRowId = (row: TypeTblLogDiscipline) => row.logDiscId;

export const columns: GridColDef<TypeTblLogDiscipline>[] = [
  {
    field: "lastName",
    headerName: "Resource Name",
    flex: 1,
    valueGetter: (_, row) =>
      `${row.tblEmployee?.firstName} ${row.tblEmployee?.lastName}`,
  },
  {
    field: "discipline",
    headerName: "Discipline",
    flex: 1,
    valueGetter: (_, row) => row.tblDiscipline?.name,
  },
  { field: "timeSpent", headerName: "TimeSpent (Minutes)", flex: 1 },
];
