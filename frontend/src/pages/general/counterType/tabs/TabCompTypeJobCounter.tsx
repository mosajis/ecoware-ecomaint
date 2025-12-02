import React, { useCallback } from "react";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import {
  tblCompTypeJobCounter,
  TypeTblCompTypeJobCounter,
} from "@/core/api/generated/api";
import { GridColDef } from "@mui/x-data-grid";
import { useDataGrid } from "../../_hooks/useDataGrid";

interface TabCompTypeJobCounterProps {
  counterTypeId: number | null | undefined;
  label?: string | null;
}

const columns: GridColDef<TypeTblCompTypeJobCounter>[] = [
  {
    field: "jobDescId",
    headerName: "Job Desc",
    flex: 1,
    valueGetter: (_, row) => row.tblCompTypeJob?.jobDescId,
  },
  {
    field: "maintTypeId",
    headerName: "Maint Type",
    flex: 1,
    valueGetter: (_, row) => row.tblCompTypeJob?.maintTypeId,
  },
  {
    field: "frequency",
    headerName: "Frequency",
    flex: 1,
    valueGetter: (_, row) => row.frequency,
  },
  {
    field: "window",
    headerName: "Window",
    flex: 1,
    valueGetter: (_, row) => row.window,
  },
  {
    field: "compTypeCounterId",
    headerName: "Type Counter Id",
    flex: 1,
    valueGetter: (_, row) => row.compTypeCounterId,
  },
];

export default function TabCompTypeJobCounter(
  props: TabCompTypeJobCounterProps
) {
  const { counterTypeId, label } = props;

  const getAll = useCallback(() => {
    return tblCompTypeJobCounter.getAll({
      filter: { counterTypeId },
      include: { tblCompTypeJob: true, tblCompTypeCounter: true },
    });
  }, [counterTypeId]);

  const { rows, loading, fetchData } = useDataGrid(
    getAll,
    tblCompTypeJobCounter.deleteById,
    "compTypeJobCounterId"
  );

  return (
    <CustomizedDataGrid
      rows={counterTypeId ? rows : []}
      columns={columns}
      loading={loading}
      label={label || undefined}
      showToolbar
      onRefreshClick={fetchData}
      getRowId={(row) => row.compTypeJobCounterId}
    />
  );
}
