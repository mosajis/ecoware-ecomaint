import { TypeTblSpareType } from "@/core/api/generated/api";
import { GridColDef } from "@mui/x-data-grid";

export const getRowId = (row: TypeTblSpareType) => row.spareTypeId;
export const getItemName = (row: TypeTblSpareType) => row.name || "-";

export const columns: GridColDef<TypeTblSpareType>[] = [
  {
    field: "partName",
    headerName: "Part Name",
    flex: 1,
    valueGetter: (_, row) => row?.name,
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
