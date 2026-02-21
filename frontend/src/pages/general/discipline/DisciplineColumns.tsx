import { TypeTblDiscipline } from "@/core/api/generated/api";
import { GridColDef } from "@mui/x-data-grid";

export const getRowId = (row: TypeTblDiscipline) => row.discId;

export const columns: GridColDef<TypeTblDiscipline>[] = [
  { field: "name", headerName: "Name", flex: 1 },
  { field: "orderNo", headerName: "Order No", width: 80 },
];
