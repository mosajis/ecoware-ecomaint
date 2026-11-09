import { TypeTblCompSpare, TypeTblSpareType } from "@/core/api/generated/api";
import { GridColDef } from "@mui/x-data-grid";

export const getRowId = (row: TypeTblCompSpare) => row.compSpareId;

export const columns: GridColDef<TypeTblCompSpare>[] = [
  {
    field: "partName",
    headerName: "Part Name",
    flex: 1,
    // @ts-ignore
    valueGetter: (_, row) => row?.TblSpareType?.name,
  },
  {
    field: "partTypeNo",
    headerName: "MESC Code",
    flex: 1,
  },
  {
    field: "makerRefNo",
    headerName: "Maker Ref",
    flex: 1,
  },
  {
    field: "extraNo",
    headerName: "Extra No",
    flex: 1,
  },
  {
    field: "note",
    headerName: "Note",
    flex: 1,
  },
  {
    field: "unit",
    headerName: "Unit",
    flex: 1,
    // @ts-ignore
    valueGetter: (_, row) => row.tblUnit?.name,
  },
];
