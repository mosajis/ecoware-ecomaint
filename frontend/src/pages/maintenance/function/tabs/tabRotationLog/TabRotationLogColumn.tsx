import { TypeTblRotationLog } from "@/core/api/generated/api";
import CellDateTime from "@/shared/components/dataGrid/cells/CellDateTime";
import { GridColDef } from "@mui/x-data-grid";

const getRowId = (row: TypeTblRotationLog) => row.rotationLogId;

const columns: GridColDef<TypeTblRotationLog>[] = [
  {
    field: "compNo",
    headerName: "Component Name",
    flex: 1,
    valueGetter: (_, row) => row.tblComponentUnit?.compNo,
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
      row.tblUsersTblRotationLogUserInsertedIdTotblUsers?.uName,
  },
  {
    field: "userRemovedId",
    headerName: "Removed By",
    flex: 1,
    valueGetter: (_, row) =>
      row.tblUsersTblRotationLogUserRemovedIdTotblUsers?.uName,
  },
  { field: "notes", headerName: "Notes", flex: 1 },
];
