import { TypeTblLogDiscipline } from "@/core/api/generated/api";
import { extractFullName } from "@/core/helper";
import { GridColDef } from "@mui/x-data-grid";

export const getRowId = (row: TypeTblLogDiscipline) => row.logDiscId;

export const columns: GridColDef<TypeTblLogDiscipline>[] = [
  {
    field: "name",
    headerName: "Resource Name",
    flex: 1,
    valueGetter: (_, row) => extractFullName(row.tblEmployee),
  },
  {
    field: "discipline",
    headerName: "Discipline",
    flex: 1,
    valueGetter: (_, row) => row.tblDiscipline?.name,
  },
  {
    field: "timeSpent",
    headerName: "Time Spent (min)",
    flex: 1,
    valueGetter: (_, row) => row.timeSpent || "--",
  },
];
