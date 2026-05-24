import { TypeTblCompTypeJobCounter } from "@/core/api/generated/api";
import { GridColDef } from "@mui/x-data-grid";

export const getRowId = (row: TypeTblCompTypeJobCounter) =>
  row.compTypeJobCounterId;

export const columns: GridColDef<TypeTblCompTypeJobCounter>[] = [
  {
    field: "counterType",
    headerName: "Counter Type",
    flex: 1,
    valueGetter: (_, row) =>
      // @ts-ignore
      row.tblCompTypeCounter?.tblCounterType?.name,
  },
  { field: "frequency", headerName: "Frequency", width: 120 },
  { field: "window", headerName: "Window", width: 120 },
  {
    field: "showInAlert",
    headerName: "Alert",
    width: 90,
    type: "boolean",
  },
  {
    field: "updateByFunction",
    headerName: "By Func",
    width: 110,
    type: "boolean",
  },
  { field: "orderNo", headerName: "Order", width: 80 },
];
