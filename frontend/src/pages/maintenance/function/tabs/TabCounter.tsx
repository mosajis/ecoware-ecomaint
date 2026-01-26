import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { useMemo } from "react";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { GridColDef } from "@mui/x-data-grid";
import { tblCounterType, TypeTblCounterType } from "@/core/api/generated/api";

interface TabCounterProps {
  functionId?: number | null;
  label?: string | null;
}

const TabCounter = ({ functionId, label }: TabCounterProps) => {
  const { rows, loading, handleRefresh } = useDataGrid(
    tblCounterType.getAll,
    tblCounterType.deleteById,
    "counterTypeId",
    !!functionId,
  );

  const columns = useMemo<GridColDef<TypeTblCounterType>[]>(
    () => [
      {
        field: "name",
        headerName: "Counter Type",
        flex: 1,
      },
      {
        field: "counterValue",
        headerName: "Counter Value",
        width: 140,
        // valueGetter: (row) => row.tblCompCounters?.[0]?.currentValue ?? "",
      },

      {
        field: "startValue",
        headerName: "Start Value",
        width: 120,
        // valueGetter: (row) => row.tblCompCounters?.[0]?.startValue ?? "",
      },
      {
        field: "useCalcAverage",
        headerName: "Use Calc Average",
        width: 160,
        // valueGetter: (row) => row.tblCompTypeCounters?.[0]?.useCalcAverage ?? "",
      },
      {
        field: "currentDate",
        headerName: "Current Date",
        width: 150,
        // valueGetter: (row) => row.tblCompCounters?.[0]?.currentDate ?? "",
      },
      {
        field: "startDate",
        headerName: "Start Date",
        width: 150,
        // valueGetter: (row) => row.tblCompCounters?.[0]?.startDate ?? "",
      },
    ],
    [],
  );

  return (
    <CustomizedDataGrid
      label={label ?? "Counter Types"}
      showToolbar
      rows={rows}
      columns={columns}
      loading={loading}
      onRefreshClick={handleRefresh}
      getRowId={(row) => row.counterTypeId}
    />
  );
};

export default TabCounter;
