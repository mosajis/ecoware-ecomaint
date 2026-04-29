import CellDateTime from "@/shared/components/dataGrid/cells/CellDateTime";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { GridColDef } from "@mui/x-data-grid";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { useCallback } from "react";
import {
  tblCompMeasurePointLog,
  TypeTblCompMeasurePointLog,
} from "@/core/api/generated/api";
import { columns, getRowId } from "./MeasurePointsLogsColumns";

export default function PageMeasurePointsLogs() {
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
      label="Measure Points Logs"
      elementId={1410}
      rows={rows}
      columns={columns}
      loading={loading}
      onRefreshClick={handleRefresh}
      getRowId={getRowId}
    />
  );
}
