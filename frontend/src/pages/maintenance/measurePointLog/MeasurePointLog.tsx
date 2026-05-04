import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { useCallback } from "react";
import { tblCompMeasurePointLog } from "@/core/api/generated/api";
import { columns, getRowId } from "./MeasurePointLogColumn";

function PageMeasurePointsLogs() {
  const getAll = useCallback(
    () =>
      tblCompMeasurePointLog.getAll({
        include: {
          tblUnit: true,
          tblCompMeasurePoint: {
            include: {
              tblCounterType: true,
              tblComponentUnit: {
                include: {
                  tblCompType: true,
                },
              },
            },
          },
        },
      }),
    [],
  );
  const { rows, loading, handleRefresh, handleDelete } = useDataGrid(
    getAll,
    tblCompMeasurePointLog.deleteById,
    "compMeasurePointId",
  );

  return (
    <CustomizedDataGrid
      showToolbar
      disableAdd
      disableEdit
      onDeleteClick={handleDelete}
      label="Measure Point Log"
      elementId={1410}
      rows={rows}
      columns={columns}
      loading={loading}
      onRefreshClick={handleRefresh}
      getRowId={getRowId}
    />
  );
}

export default PageMeasurePointsLogs;
