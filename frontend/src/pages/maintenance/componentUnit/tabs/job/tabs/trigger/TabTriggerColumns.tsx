import { TypeTblCompJobTrigger } from "@/core/api/generated/api";
import { GridColDef } from "@mui/x-data-grid";

export const getRowId = (row: TypeTblCompJobTrigger) => row.compJobTriggerId;

// === Columns ===
export const columns: GridColDef<TypeTblCompJobTrigger>[] = [
  {
    field: "Trigger",
    headerName: "Trigger",
    flex: 1,
    valueGetter: (_, row) => row.tblJobTrigger?.descr,
  },
  { field: "orderNo", headerName: "Order No", width: 80 },
];
