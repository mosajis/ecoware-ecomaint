import { TypeTblMaintLogSpare } from "@/core/api/generated/api";
import { GridColDef } from "@mui/x-data-grid";

export const getRowId = (row: TypeTblMaintLogSpare) => row.maintLogStockId;

export const columns: GridColDef<TypeTblMaintLogSpare>[] = [
  {
    field: "partName",
    headerName: "Part Name",
    flex: 1,
    // @ts-ignore
    valueGetter: (_, row) => row?.tblSpareUnit?.tblSpareType.name,
  },
  {
    field: "partTypeNo",
    headerName: "MESC Code",
    flex: 1,
    // @ts-ignore
    valueGetter: (_, row) => row?.tblSpareUnit.tblSpareType.partTypeNo,
  },
  {
    field: "makerRefNo",
    headerName: "Maker Ref",
    flex: 1,
    // @ts-ignore
    valueGetter: (_, row) => row?.tblSpareUnit.tblSpareType.makerRefNo,
  },
];
