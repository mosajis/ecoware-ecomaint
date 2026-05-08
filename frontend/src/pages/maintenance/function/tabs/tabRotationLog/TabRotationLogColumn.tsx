import CellDateTime from "@/shared/components/dataGrid/cells/CellDateTime";
import CellLink from "@/shared/components/dataGrid/cells/CellLink";
import { TypeTblRotationLog } from "@/core/api/generated/api";
import { GridColDef } from "@mui/x-data-grid";
import { extractFullName } from "@/core/helper";
import { RouteDetail as RouteComponentUnitDetail } from "../../../componentUnit/ComponentUnitRoutes";

export const getRowId = (row: TypeTblRotationLog) => row.rotationLogId;

export const columns: GridColDef<TypeTblRotationLog>[] = [
  {
    field: "compNo",
    headerName: "Component Name",
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
  {
    field: "fromDate",
    headerName: "From Date",
    width: 130,
    renderCell: ({ value }) => <CellDateTime value={value} type="DATE" />,
  },
  {
    field: "toDate",
    headerName: "To Date",
    width: 130,
    renderCell: ({ value }) => <CellDateTime value={value} type="DATE" />,
  },
  {
    field: "userInsertedId",
    headerName: "Inserted By",
    flex: 1,
    valueGetter: (_, row) =>
      extractFullName(
        row.tblEmployeeTblRotationLogEmployeeInsertedIdTotblEmployee,
      ),
  },
  {
    field: "userRemovedId",
    headerName: "Removed By",
    flex: 1,
    valueGetter: (_, row) =>
      extractFullName(
        row.tblEmployeeTblRotationLogEmployeeRemovedIdTotblEmployee,
      ),
  },
  { field: "notes", headerName: "Notes", flex: 1 },
];
