import { GridColDef } from "@mui/x-data-grid";
import { TypeTblUserGroup } from "@/core/api/generated/api";
import CellLink from "@/shared/components/dataGrid/cells/CellLink";
import { RouteDetail } from "./UserGroupRoutes";

export const columns: GridColDef<TypeTblUserGroup>[] = [
  {
    field: "name",
    headerName: "Name",
    flex: 1,
    valueGetter: (_, row) => row.name,
    renderCell: ({ value, row }) => (
      <CellLink
        breadcrumb={row.name}
        value={row.name}
        to={RouteDetail.to}
        params={{ id: row.userGroupId }}
      />
    ),
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
