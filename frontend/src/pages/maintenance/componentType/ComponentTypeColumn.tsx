import { TypeTblCompType } from "@/core/api/generated/api";
import CellLink from "@/shared/components/dataGrid/cells/CellLink";
import { GridColDef } from "@mui/x-data-grid";
import { RouteDetail } from "./ComponentTypeRoutes";

export const getRowId = (row: TypeTblCompType) => row.compTypeId;
export const getItemName = (row: TypeTblCompType) => row.compName || "-";

export const columns: GridColDef<TypeTblCompType>[] = [
  {
    field: "compTypeNo",
    headerName: "Code",
    width: 120,
    renderCell: ({ value, row }) => (
      <CellLink
        breadcrumb={row.compName || ""}
        value={row.compTypeNo}
        to={RouteDetail.to}
        params={{ id: row.compTypeId }}
      />
    ),
  },
  {
    field: "compName",
    headerName: "Name",
    flex: 1,
  },
  { field: "compType", headerName: "Model/Type", width: 200 },
  { field: "orderNo", headerName: "OrderNo", width: 100 },
];
