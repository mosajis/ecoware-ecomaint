import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { useCallback, useMemo } from "react";
import {
  tblCompMeasurePoint,
  tblCompTypeMeasurePoint,
  TypeTblWorkOrder,
  type TypeTblCompMeasurePoint,
} from "@/core/api/generated/api";
import { GridColDef } from "@mui/x-data-grid";
import { useDataGrid } from "@/shared/hooks/useDataGrid";

interface Props {
  workOrder?: TypeTblWorkOrder | null;
  label?: string | null;
}

const TabMeasurePoints = ({ workOrder }: Props) => {
  // === getAll callback ===
  const getAll = useCallback(() => {
    return tblCompMeasurePoint.getAll({
      filter: {
        compId: workOrder?.compId,
      },
      include: {
        tblUnit: true,
        tblCounterType: true,
      },
    });
  }, [workOrder]);

  // === useDataGrid ===
  const { rows, loading, handleDelete, handleRefresh } = useDataGrid(
    getAll,
    tblCompTypeMeasurePoint.deleteById,
    "compMeasurePointId",
    !!workOrder?.compId
  );

  // === Columns ===
  const columns = useMemo<GridColDef<TypeTblCompMeasurePoint>[]>(
    () => [
      {
        field: "currentDate",
        headerName: "Current Date",
        flex: 1,
      },
      {
        field: "currentValue",
        headerName: "Current Value",
        flex: 1,
      },
      {
        field: "counterTypeName",
        headerName: "Counter Type Name",
        flex: 1,
      },

      {
        field: "newValue",
        headerName: "New Value",
        flex: 1,
      },

      {
        field: "isMandatory",
        headerName: "is Mandatory",
        flex: 1,
      },

      {
        field: "unitName",
        headerName: "Unit Name",
        flex: 1,
        valueGetter: (v, row) => row?.tblUnit?.name,
      },
      {
        field: "unitDescription",
        headerName: "Unit Description",
        flex: 1,
        valueGetter: (v, row) => row?.tblUnit?.description,
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
      getRowId={(row) => row.compMeasurePointId}
    />
  );
};

export default TabMeasurePoints;
