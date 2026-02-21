import { TypeTblFollowStatus } from "@/core/api/generated/api";
import { GridColDef } from "@mui/x-data-grid";

export const getRowId = (row: TypeTblFollowStatus) => row.followStatusId;

export const columns: GridColDef<TypeTblFollowStatus>[] = [
  { field: "fsName", headerName: "Name", flex: 1 },
  { field: "fsDesc", headerName: "Description", flex: 2 },
  { field: "orderNo", headerName: "Order No", width: 80 },
];
