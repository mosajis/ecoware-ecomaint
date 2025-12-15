import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { useMemo } from "react";
import {
  tblCompMeasurePoint,
  TypeTblCompMeasurePoint,
} from "@/core/api/generated/api";
import { type GridColDef } from "@mui/x-data-grid";
import { useDataGrid } from "@/shared/hooks/useDataGrid";

export default function PageMeasurePointsLogs() {
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
        headerName: "Unit Name",
        // valueGetter: (_, row) => row?.compTypeNo,
      },
      {
        field: "compType",
        headerName: "Unit Description",
        // valueGetter: (_, row) => row?.compType,
      },
      {
        field: "compNo",
        headerName: "CompNo",
        // valueGetter: (_, row) => row?.compNo,
      },
      {
        field: "measureName",
        headerName: "Measure Type",
        // valueGetter: (_, row) => row?.measureName,
      },
      {
        field: "currentValue",
        headerName: "Current Value",
        valueGetter: (_, row) => row.currentValue,
      },
      {
        field: "currentDate",
        headerName: "Current Date",
        valueGetter: (_, row) => row.currentDate,
      },
      {
        field: "firstName",
        headerName: "First Name",
        // valueGetter: (_, row) => row.firstName,
      },
      {
        field: "lastName",
        headerName: "Last Name",
        // valueGetter: (_, row) => row.lastName,
      },
      {
        field: "changedDate",
        headerName: "Changed Date",
        // valueGetter: (_, row) => row.changedDate,
      },
      {
        field: "minValue",
        headerName: "Min Value",
        width: 150,
        // valueGetter: (_, row) => row.minValue,
      },
      {
        field: "maxValue",
        headerName: "Max Value",
        // valueGetter: (_, row) => row.maxValue,
      },
      {
        field: "unitName",
        headerName: "Unit Name",
        // valueGetter: (_, row) => row.tblUnit?.unitName,
      },
      {
        field: "unitDescription",
        headerName: "Unit Description",
        valueGetter: (_, row) => row.tblUnit?.description,
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
