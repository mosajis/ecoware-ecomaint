import CellLink from "@/shared/components/dataGrid/cells/CellLink";
import { TypeTblComponentUnit } from "@/core/api/generated/api";
import { GridColDef } from "@mui/x-data-grid";
import { RouteDetail } from "./ComponentUnitRoutes";
import { RouteDetail as RouteDetailType } from "../componentType/ComponentTypeRoutes";

export const getRowId = (row: TypeTblComponentUnit) => row.compId;
export const getItemName = (row: TypeTblComponentUnit) => row.compNo || "-";

export const columns: GridColDef<TypeTblComponentUnit>[] = [
  {
    field: "compNo",
    headerName: "Component No",
    width: 280,
    renderCell: ({ value, row }) => (
      <CellLink
        breadcrumb={value}
        value={value}
        to={RouteDetail.to}
        params={{ id: row.compId }}
      />
    ),
  },
  { field: "model", headerName: "Model / Type", flex: 1 },
  { field: "serialNo", headerName: "Serial No", flex: 1 },
  {
    field: "locationId",
    headerName: "Location",
    flex: 1,
    valueGetter: (_, row) => row.tblLocation?.name ?? "",
  },

  {
    field: "compType",
    headerName: "Component Type",
    flex: 1,
    valueGetter: (_, row) => row.tblCompType?.compName ?? "",
    renderCell: ({ value, row }) => (
      <CellLink
        breadcrumb={value}
        value={value}
        to={RouteDetailType.to}
        params={{ id: row.compTypeId }}
      />
    ),
  },
  {
    field: "statusId",
    headerName: "Status",
    width: 120,
    valueGetter: (_, row) => row.tblCompStatus?.compStatusName ?? "",
  },
  { field: "orderNo", headerName: "Order No", width: 85 },
];
