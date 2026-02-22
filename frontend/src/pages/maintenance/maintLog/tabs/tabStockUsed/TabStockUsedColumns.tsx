import { TypeTblMaintLogStocks } from "@/core/api/generated/api";
import { GridColDef } from "@mui/x-data-grid";

export const getRowId = (row: TypeTblMaintLogStocks) => row.maintLogStockId;
export const columns: GridColDef<TypeTblMaintLogStocks>[] = [
  {
    field: "stockNo",
    headerName: "Extra No",
    width: 100,
    // @ts-ignore
    valueGetter: (_, row) => row?.tblSpareUnit?.tblSpareType.no,
  },
  {
    field: "stockName",
    headerName: "Stock Name",
    flex: 1,
    // @ts-ignore
    valueGetter: (_, row) => row?.tblSpareUnit?.tblSpareType.name,
  },
];
