import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { useMemo } from "react";
import {
  tblCompCounterLog,
  TypeTblCompCounterLog,
} from "@/core/api/generated/api";
import { type GridColDef } from "@mui/x-data-grid";
import { useDataGrid } from "@/shared/hooks/useDataGrid";

export default function PageCounterLog() {
  // === useDataGrid ===
  const { rows, loading, handleRefresh } = useDataGrid<TypeTblCompCounterLog>(
    tblCompCounterLog.getAll,
    tblCompCounterLog.deleteById,
    "compCounterLogId"
  );

  // === Columns ===
  const columns = useMemo<GridColDef<TypeTblCompCounterLog>[]>(
    () => [
      {
        field: "component",
        headerName: "Component",
        width: 150,
        // @ts-ignore
        valueGetter: (_, row) => row?.tblCompCounter?.tblComponentUnit?.compNo,
      },
      {
        field: "componentType",
        headerName: "Component Type",
        width: 150,
        // @ts-ignore
        valueGetter: (_, row) =>
          // @ts-ignore
          row?.tblCompCounter?.tblComponentUnit?.compType,
      },
      {
        field: "counterName",
        headerName: "Counter Name",
        width: 150,
        // @ts-ignore
        valueGetter: (_, row) => row?.tblCompCounter?.counterName,
      },
      {
        field: "startDate",
        headerName: "Start Date",
        width: 150,
        valueGetter: (_, row) => row.startDate,
      },
      {
        field: "startValue",
        headerName: "Start Value",
        width: 120,
        valueGetter: (_, row) => row.startValue,
      },
      {
        field: "currentDate",
        headerName: "Current Date",
        width: 150,
        valueGetter: (_, row) => row.currentDate,
      },
      {
        field: "currentValue",
        headerName: "Current Value",
        width: 120,
        valueGetter: (_, row) => row.currentValue,
      },
    ],
    []
  );

  return (
    <CustomizedDataGrid
      label="Counter Logs"
      showToolbar
      onRefreshClick={handleRefresh}
      rows={rows}
      columns={columns}
      loading={loading}
      getRowId={(row) => row.compCounterLogId}
    />
  );
}
