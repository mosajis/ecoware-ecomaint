import { TypeTblJobTrigger } from "@/core/api/generated/api";
import { GridColDef } from "@mui/x-data-grid";

export const getRowId = (row: TypeTblJobTrigger) => row.jobTriggerId;

export const columns: GridColDef<TypeTblJobTrigger>[] = [
  { field: "descr", headerName: "Description", flex: 1 },
  { field: "orderNo", headerName: "Order No", width: 100 },
];
