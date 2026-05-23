import { TypeTblComponentUnit } from "@/core/api/generated/api";
import { GridColDef } from "@mui/x-data-grid";
import CellLink from "@/shared/components/dataGrid/cells/CellLink";
import { RouteDetail } from "../../componentUnit/ComponentUnitRoutes";

export const getRowId = (row: TypeTblComponentUnit) => row.compId;

// === Columns ===
export const columns: GridColDef<TypeTblComponentUnit>[] = [
  {
    field: "typeNo",
    headerName: "Type No",
    width: 80,
    valueGetter: (v, row) => row?.tblCompType?.compTypeNo,
  },
  {
    field: "compName",
    headerName: "Comp Name",
    width: 200,
    valueGetter: (v, row) => row?.tblCompType?.compName,
  },
  {
    field: "compNo",
    headerName: "Comp No",
    flex: 1,
    renderCell: ({ value, row }) => (
      <CellLink
        breadcrumb={row.compNo || ""}
        value={row.compNo}
        to={RouteDetail.to}
        params={{ id: row.compId }}
      />
    ),
  },
  {
    field: "model",
    headerName: "Model",
    flex: 1,
  },
  {
    field: "location",
    headerName: "Location",
    flex: 1,
    valueGetter: (v, row) => row.tblLocation?.name,
  },
  {
    field: "serialNo",
    headerName: "Serial",
    flex: 1,
  },
];
