import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { useCallback, useMemo } from "react";
import {
  tblCompTypeMeasurePoint,
  type TypeTblCompTypeMeasurePoint,
} from "@/core/api/generated/api";
import { useDataGrid } from "@/pages/general/_hooks/useDataGrid";
import { GridColDef } from "@mui/x-data-grid";

type Props = {
  selected?: number | null;
};

const TabMeasuresPage = ({ selected }: Props) => {
  // === getAll callback ===
  const getAll = useCallback(() => {
    if (!selected) return Promise.resolve({ items: [] });

    return tblCompTypeMeasurePoint.getAll({
      filter: {
        compTypeId: selected,
      },
      include: {
        tblUnit: true,
        tblCounterType: true,
      },
    });
  }, [selected]);

  // === useDataGrid ===
  const { rows, loading, fetchData, handleDelete } = useDataGrid(
    getAll,
    tblCompTypeMeasurePoint.deleteById,
    "compTypeMeasurePointId"
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
      onRefreshClick={fetchData}
      getRowId={(row) => row.compTypeMeasurePointId}
    />
  );
};

export default TabMeasuresPage;
