import { GridColDef } from "@mui/x-data-grid";
import { TypeTblUserGroup } from "@/core/api/generated/api";

export const columns: GridColDef[] = [
  {
    field: "name",
    headerName: "Name",
    flex: 1,
  },
  {
    field: "description",
    headerName: "Description",
    flex: 1,
  },
  {
    field: "orderNo",
    headerName: "OrderNo",
    width: 90,
  },
];

export const getRowId = (row: TypeTblUserGroup) => row.userGroupId;
