import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import CellDateTime from "@/shared/components/dataGrid/cells/CellDateTime";
import { useCallback } from "react";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { GridColDef } from "@mui/x-data-grid";
import {
  tblRotationLog,
  TypeTblFunctions,
  TypeTblRotationLog,
} from "@/core/api/generated/api";

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

interface Props {
  recordFunction?: TypeTblFunctions;
  label?: string;
}

const TabRotationLog = ({ recordFunction, label }: Props) => {
  const functionId = recordFunction?.functionId;

  const getAll = useCallback(
    () =>
      tblRotationLog.getAll({
        include: {
          tblComponentUnit: true,
          tblUsersTblRotationLogUserInsertedIdTotblUsers: true,
          tblUsersTblRotationLogUserRemovedIdTotblUsers: true,
        },
        filter: {
          functionId: functionId,
        },
      }),
    [functionId],
  );

  const { rows, loading, handleRefresh } = useDataGrid(
    getAll,
    tblRotationLog.deleteById,
    "rotationLogId",
    !!functionId,
  );

  return (
    <CustomizedDataGrid
      label={label}
      disableAdd
      disableRowSelectionOnClick
      disableEdit
      disableDelete
      showToolbar={!!label}
      rows={rows}
      columns={columns}
      loading={loading}
      onRefreshClick={handleRefresh}
      getRowId={getRowId}
    />
  );
};

export default TabRotationLog;
