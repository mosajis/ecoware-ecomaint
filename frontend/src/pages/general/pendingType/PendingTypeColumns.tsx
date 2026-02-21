import { TypeTblPendingType } from "@/core/api/generated/api";
import { GridColDef } from "@mui/x-data-grid";

export const getRowId = (row: TypeTblPendingType) => row.pendTypeId;

export const columns: GridColDef<TypeTblPendingType>[] = [
  { field: "pendTypeName", headerName: "Name", flex: 2 },
  { field: "description", headerName: "Description", flex: 2 },
  { field: "orderNo", headerName: "Order No", width: 120 },
];
