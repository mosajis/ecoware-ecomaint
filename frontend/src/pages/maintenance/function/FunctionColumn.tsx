import CellLink from "@/shared/components/dataGrid/cells/CellLink";
import { TypeTblFunction } from "@/core/api/generated/api";
import { GridColDef } from "@mui/x-data-grid";
import { RouteDetail } from "./FunctionRoutes";
import { RouteDetail as RouteComponentUnitDetail } from "../componentUnit/ComponentUnitRoutes";

export const getRowId = (row: TypeTblFunction) => row.functionId;
export const getItemName = (row: TypeTblFunction) => row.funcNo || "-";

export const columns: GridColDef<TypeTblFunction>[] = [
  {
    field: "funcNo",
    headerName: "Function No",
    flex: 1,
  },
  { field: "funcDesc", headerName: "Function Desc", flex: 1 },
  {
    field: "component",
    headerName: "Component",
    flex: 1,
    valueGetter: (_, row) => row.tblComponentUnit?.compNo,
    renderCell: ({ value, row }) => (
      <CellLink
        breadcrumb={value}
        value={value}
        to={RouteComponentUnitDetail.to}
        params={{ id: row.compId }}
      />
    ),
  },
  { field: "orderNo", headerName: "Order No", width: 85 },
];
