import { TypeTblFunctions } from "@/core/api/generated/api";
import { GridColDef } from "@mui/x-data-grid";

export const getRowId = (row: TypeTblFunctions) => row.functionId;
export const getItemName = (row: TypeTblFunctions) => row.funcNo || "-";

export const columns: GridColDef<TypeTblFunctions>[] = [
  { field: "funcNo", headerName: "Function No", flex: 1 },
  { field: "funcDesc", headerName: "Function Desc", flex: 1 },
  {
    field: "component",
    headerName: "Component",
    flex: 1,
    valueGetter: (_, row) => row.tblComponentUnit?.compNo,
  },
  { field: "orderNo", headerName: "Order No", width: 85 },
];
