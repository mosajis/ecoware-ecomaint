import { TypeTblSpareUnit } from "@/core/api/generated/api";
import { GridColDef } from "@mui/x-data-grid";

export const getRowId = (row: TypeTblSpareUnit) => row.spareUnitId;

export const columns: GridColDef<TypeTblSpareUnit>[] = [
  {
    field: "number",
    headerName: "Number",
    valueGetter: (_, row) => row.tblSpareType?.no,
  },
  {
    field: "tblSpareType",
    headerName: "Spare Type",
    flex: 1,
    valueGetter: (_, row) => row.tblSpareType?.name,
  },
];
