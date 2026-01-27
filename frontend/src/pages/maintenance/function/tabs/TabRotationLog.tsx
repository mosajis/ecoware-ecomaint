import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { useCallback, useMemo } from "react";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { GridColDef } from "@mui/x-data-grid";
import { tblRotationLog, TypeTblRotationLog } from "@/core/api/generated/api";

const getRowId = (row: TypeTblRotationLog) => row.rotationLogId;

interface Props {
  functionId?: number | null;
  label?: string | null;
}

const TabRotationLog = ({ functionId, label }: Props) => {
  const getAll = useCallback(
    () =>
      tblRotationLog.getAll({
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

  const columns = useMemo<GridColDef<TypeTblRotationLog>[]>(
    () => [
      { field: "compNo", headerName: "Comp ID", width: 100 },
      { field: "fromDate", headerName: "From Date", width: 150 },
      { field: "functionId", headerName: "Function ID", width: 120 },
      { field: "userInsertedId", headerName: "User Inserted", width: 120 },
      { field: "userRemovedId", headerName: "User Removed", width: 120 },
      { field: "notes", headerName: "Notes", flex: 1 },
      { field: "lastupdate", headerName: "Last Update", width: 150 },
    ],
    [],
  );

  return (
    <CustomizedDataGrid
      label={label ?? "Rotation Log"}
      disableAdd
      disableEdit
      disableDelete
      showToolbar
      rows={rows}
      columns={columns}
      loading={loading}
      onRefreshClick={handleRefresh}
      getRowId={getRowId}
    />
  );
};

export default TabRotationLog;
