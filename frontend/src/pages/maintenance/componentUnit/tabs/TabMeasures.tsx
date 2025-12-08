import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { useCallback, useMemo } from "react";
import {
  tblCompTypeMeasurePoint,
  type TypeTblCompTypeMeasurePoint,
} from "@/core/api/generated/api";
import { GridColDef } from "@mui/x-data-grid";
import { useDataGrid } from "@/shared/hooks/useDataGrid";

interface TabMaintLogProps {
  compUnitId?: number | null;
  label?: string | null;
}

const TabMeasures = ({ compUnitId }: TabMaintLogProps) => {
  // === getAll callback ===
  const getAll = useCallback(() => {
    if (!compUnitId) return Promise.resolve({ items: [] });

    return tblCompTypeMeasurePoint.getAll({
      include: {
        tblUnit: true,
        tblCounterType: true,
      },
    });
  }, [compUnitId]);

  // === useDataGrid ===
  const { rows, loading, handleDelete, handleRefresh } = useDataGrid(
    getAll,
    tblCompTypeMeasurePoint.deleteById,
    "compTypeMeasurePointId",
    !!compUnitId
  );

  // === Columns ===
  const columns = useMemo<GridColDef<TypeTblCompTypeMeasurePoint>[]>(
    () => [
      {
        field: "measureName",
        headerName: "Measure Name",
        flex: 1,
        valueGetter: (v, row) => row?.tblCounterType?.name,
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
      { field: "setValue", headerName: "Set Value", flex: 1 },
      {
        field: "operationalMinValue",
        headerName: "Min Value",
        flex: 1,
      },
      {
        field: "operationalMaxValue",
        headerName: "Max Value",
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

export default TabMeasures;
