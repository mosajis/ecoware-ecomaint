import { RouteDetail as RouteComponentUnit } from "@/pages/maintenance/componentUnit/ComponentUnitRoutes";
import { RouteDetail as RouteComponentType } from "@/pages/maintenance/componentType/ComponentTypeRoutes";
import { GridColDef } from "@mui/x-data-grid";
import { TypeTblCompCounter } from "@/core/api/generated/api";
import CellLink from "@/shared/components/dataGrid/cells/CellLink";

export const getRowId = (row: TypeTblCompCounter) => row.compCounterId;

export const columns: GridColDef<TypeTblCompCounter>[] = [
  {
    field: "compNo",
    headerName: "Component",
    flex: 2,
    valueGetter: (_, row) => row.tblComponentUnit?.compNo,
    renderCell: ({ value, row }) => (
      <CellLink
        breadcrumb={value}
        value={value}
        to={RouteComponentUnit.to}
        params={{ id: row.tblComponentUnit?.compId }}
      />
    ),
  },
  {
    field: "CompType",
    headerName: "CompType",
    flex: 2,
    // @ts-ignore
    valueGetter: (_, row) => row.tblComponentUnit?.tblCompType?.compName,
    renderCell: ({ value, row }) => (
      <CellLink
        breadcrumb={value}
        value={value}
        to={RouteComponentType.to}
        // @ts-ignore
        params={{ id: row.tblComponentUnit?.tblCompType?.compTypeId }}
      />
    ),
  },
  {
    field: "model",
    headerName: "Model",
    flex: 1,
    valueGetter: (_, row) => row.tblComponentUnit?.model,
  },
  {
    field: "serialNo",
    headerName: "SerialNo",
    flex: 1,
    valueGetter: (_, row) => row.tblComponentUnit?.serialNo,
  },
  {
    field: "statusId",
    headerName: "Status",
    width: 80,
    valueGetter: (_, row) =>
      // @ts-ignore
      row.tblComponentUnit?.tblCompStatus?.compStatusName,
  },
];
