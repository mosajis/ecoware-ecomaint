import { TypeTblLocation } from "@/core/api/generated/api";
import { GridColDef } from "@mui/x-data-grid";

export const getRowId = (row: TypeTblLocation) => row.locationId;

export const columns: GridColDef<TypeTblLocation>[] = [
  { field: "locationCode", headerName: "Code", width: 60 },
  { field: "name", headerName: "Name", flex: 1 },
  {
    field: "parentLocation",
    headerName: "Parent",
    flex: 1,
    valueGetter: (_, row) => row?.tblLocation?.name,
  },
  { field: "orderNo", headerName: "Order No", width: 80 },
];
