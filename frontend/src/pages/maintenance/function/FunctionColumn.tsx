import CellLink from "@/shared/components/dataGrid/cells/CellLink";
import { TypeTblFunction } from "@/core/api/generated/api";
import { GridColDef } from "@mui/x-data-grid";
import { RouteDetail } from "./FunctionRoutes";

export const getRowId = (row: TypeTblFunction) => row.functionId;
export const getItemName = (row: TypeTblFunction) => row.funcNo || "-";

export const columns: GridColDef<TypeTblFunction>[] = [
  {
    field: "funcNo",
    headerName: "Function No",
    flex: 1,
    renderCell: ({ value, row }) => (
      <CellLink
        breadcrumb={row.funcNo}
        value={row.funcNo}
        to={RouteDetail.to}
        params={{ id: row.functionId }}
      />
    ),
  },
  { field: "funcDesc", headerName: "Function Desc", flex: 1 },
  {
    field: "component",
    headerName: "Component",
    flex: 1,
    valueGetter: (_, row) => row.tblComponentUnit?.compNo,
  },
  { field: "orderNo", headerName: "Order No", width: 85 },
];
