import { TypeTblJobClass } from "@/core/api/generated/api";
import { GridColDef } from "@mui/x-data-grid";

export const getRowId = (row: TypeTblJobClass) => row.jobClassId;

export const columns: GridColDef<TypeTblJobClass>[] = [
  { field: "code", headerName: "Code", width: 60 },
  { field: "name", headerName: "Name", flex: 1 },
  { field: "orderNo", headerName: "Order No", width: 80 },
];
