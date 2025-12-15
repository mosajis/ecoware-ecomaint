import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { useMemo } from "react";
import {
  tblCompMeasurePoint,
  TypeTblCompMeasurePoint,
} from "@/core/api/generated/api";
import { type GridColDef } from "@mui/x-data-grid";
import { useDataGrid } from "@/shared/hooks/useDataGrid";

export default function PageMeasurePoints() {
  // === useDataGrid ===
  const { rows, loading, handleRefresh } = useDataGrid<TypeTblCompMeasurePoint>(
    tblCompMeasurePoint.getAll,
    tblCompMeasurePoint.deleteById,
    "compMeasurePointId"
  );

  // === Columns ===
  const columns = useMemo<GridColDef<TypeTblCompMeasurePoint>[]>(
    () => [
      {
        field: "compTypeNo",
        headerName: "CompType No",
        width: 100,
        // valueGetter: (row) => row.compTypeNo,
      },
      {
        field: "compType",
        headerName: "CompType",
        width: 120,
        // valueGetter: (row) => row.compType,
      },
      {
        field: "compNo",
        headerName: "CompNo",
        width: 120,
        // valueGetter: (row) => row.compNo,
      },
      {
        field: "measureName",
        headerName: "Measure Name",
        width: 150,
        // valueGetter: (row) => row.measureName,
      },
      {
        field: "currentValue",
        headerName: "Current Value",
        width: 120,
        // valueGetter: (row) => row.currentValue,
      },
      {
        field: "currentDate",
        headerName: "Current Date",
        width: 150,
        // valueGetter: (row) => row.currentDate,
      },
      {
        field: "operationalMinValue",
        headerName: "Optional Min Value",
        width: 150,
        // valueGetter: (row) => row.operationalMinValue,
      },
      {
        field: "setValue",
        headerName: "Set Value",
        width: 120,
        // valueGetter: (row) => row.setValue,
      },
      {
        field: "operationalMaxValue",
        headerName: "Optional Max Value",
        width: 150,
        // valueGetter: (row) => row.operationalMaxValue,
      },
      {
        field: "unitName",
        headerName: "Unit Name",
        width: 120,
        // valueGetter: (row) => row.tblUnit?.unitName,
      },
      {
        field: "unitDescription",
        headerName: "Unit Description",
        width: 150,
        // valueGetter: (row) => row.tblUnit?.description,
      },
    ],
    []
  );

  return (
    <CustomizedDataGrid
      label="Measure Points"
      showToolbar
      onRefreshClick={handleRefresh}
      rows={rows}
      columns={columns}
      loading={loading}
      getRowId={(row) => row.compMeasurePointId}
    />
  );
}
