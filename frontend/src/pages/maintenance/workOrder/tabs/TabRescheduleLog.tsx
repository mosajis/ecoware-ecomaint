import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { useCallback, useMemo } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import {
  tblCompTypeMeasurePoint,
  tblReScheduleLog,
  TypeTblWorkOrder,
  type TypeTblCompMeasurePoint,
} from "@/core/api/generated/api";

interface Props {
  workOrder?: TypeTblWorkOrder | null;
  label?: string | null;
}

const TabRescheduleLog = ({ workOrder, label }: Props) => {
  // === getAll callback ===
  const getAll = useCallback(() => {
    return tblReScheduleLog.getAll({
      filter: {
        workOrderId: workOrder?.workOrderId,
      },
    });
  }, [workOrder?.workOrderId]);

  // === useDataGrid ===
  const { rows, loading, handleDelete, handleRefresh } = useDataGrid(
    getAll,
    tblReScheduleLog.deleteById,
    "rescheduleLogId",
    !!workOrder?.workOrderId
  );

  // === Columns ===
  const columns = useMemo<GridColDef<TypeTblCompMeasurePoint>[]>(
    () => [
      {
        field: "fromDueDate",
        headerName: "From Due Date",
        flex: 1,
      },
      {
        field: "toDueDate",
        headerName: "To Due Date",
        flex: 1,
      },
      {
        field: "ReScheduleDate",
        headerName: "Re Schedule Date",
        flex: 1,
      },
      {
        field: "username",
        headerName: "Username",
        flex: 1,
      },
      {
        field: "reason",
        headerName: "Reason",
        flex: 1,
      },
    ],
    []
  );

  return (
    <CustomizedDataGrid
      label={label || "Reschedule Log"}
      rows={rows}
      columns={columns}
      loading={loading}
      showToolbar
      onRefreshClick={handleRefresh}
      getRowId={(row) => row.rescheduleLogId}
    />
  );
};

export default TabRescheduleLog;
