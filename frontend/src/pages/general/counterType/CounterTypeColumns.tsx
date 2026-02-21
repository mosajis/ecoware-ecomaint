import { TypeTblCounterType } from "@/core/api/generated/api";
import { GridColDef } from "@mui/x-data-grid";

export const getRowId = (row: TypeTblCounterType) => row.counterTypeId;

export const columns: GridColDef<TypeTblCounterType>[] = [
  { field: "name", headerName: "Name", flex: 1 },

  {
    field: "type",
    headerName: "Type",
    width: 120,
    valueGetter: (_, row) => (row.type === 3 ? "Measure Point" : "Counter"),
  },
  { field: "orderNo", headerName: "Order No", width: 80 },
];
