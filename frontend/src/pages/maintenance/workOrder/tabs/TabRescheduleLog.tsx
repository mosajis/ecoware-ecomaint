import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { useCallback, useMemo } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import {
  tblCompTypeMeasurePoint,
  type TypeTblCompMeasurePoint,
} from "@/core/api/generated/api";

interface Props {
  workOrderId?: number | null;
  label?: string | null;
}

const TabRescheduleLog = ({ workOrderId }: Props) => {
  // === getAll callback ===
  const getAll = useCallback(() => {
    return tblCompTypeMeasurePoint.getAll({
      include: {
        tblUnit: true,
        tblCounterType: true,
      },
    });
  }, []);

  // === useDataGrid ===
  const { rows, loading, handleDelete, handleRefresh } = useDataGrid(
    getAll,
    tblCompTypeMeasurePoint.deleteById,
    "compTypeMeasurePointId"
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
      label="Measures"
      rows={rows}
      columns={columns}
      loading={loading}
      showToolbar
      onRefreshClick={handleRefresh}
      getRowId={(row) => row.compTypeMeasurePointId}
    />
  );
};

export default TabRescheduleLog;
