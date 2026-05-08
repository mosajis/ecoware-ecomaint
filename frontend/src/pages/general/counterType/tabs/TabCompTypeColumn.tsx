import { TypeTblCompTypeCounter } from "@/core/api/generated/api";
import { RouteDetail } from "@/pages/maintenance/componentType/ComponentTypeRoutes";
import CellLink from "@/shared/components/dataGrid/cells/CellLink";
import { GridColDef } from "@mui/x-data-grid";

export const getRowId = (row: TypeTblCompTypeCounter) => row.compTypeCounterId;

export const columns: GridColDef<TypeTblCompTypeCounter>[] = [
  {
    field: "code",
    headerName: "Code",
    width: 120,
    valueGetter: (_, row) => row.tblCompType?.compTypeNo,
  },
  {
    field: "name",
    headerName: "Name",
    flex: 1,
    valueGetter: (_, row) => row?.tblCompType?.compName,
    renderCell: ({ value, row }) => (
      <CellLink
        breadcrumb={value}
        value={value}
        to={RouteDetail.to}
        // @ts-ignore
        params={{ id: row.tblCompType?.compTypeId }}
      />
    ),
  },
];
