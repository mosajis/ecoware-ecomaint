import React, { useCallback } from "react";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import {
  tblCompJobCounter,
  TypeTblCompJobCounter,
} from "@/core/api/generated/api";
import { GridColDef } from "@mui/x-data-grid";
import { useDataGrid } from "../../_hooks/useDataGrid";

interface TabCompJobCounterProps {
  counterTypeId: number | null | undefined;
  label?: string | null;
}

const columns: GridColDef<TypeTblCompJobCounter>[] = [
  {
    field: "jobDesc",
    headerName: "Job Description",
    flex: 1,
    valueGetter: (_, row) => row.tblCompJob?.jobDescId,
  },
  {
    field: "maintType",
    headerName: "Maint Type",
    flex: 1,
    valueGetter: (_, row) => row.tblCompJob?.maintTypeId,
  },
  {
    field: "frequency",
    headerName: "Frequency",
    flex: 1,
    valueGetter: (_, row) => row.frequency,
  },
  {
    field: "lastDoneCount",
    headerName: "Last Done Count",
    flex: 1,
    valueGetter: (_, row) => row.lastDoneCount,
  },
  {
    field: "nextDueCount",
    headerName: "Next Due Count",
    flex: 1,
    valueGetter: (_, row) => row.nextDueCount,
  },
  {
    field: "window",
    headerName: "Window",
    flex: 1,
    valueGetter: (_, row) => row.window,
  },
  {
    field: "compCounterId",
    headerName: "Comp Counter Id",
    flex: 1,
    valueGetter: (_, row) => row.compCounterId,
  },
];

export default function TabCompJobCounter(props: TabCompJobCounterProps) {
  const { counterTypeId, label } = props;

  if (!counterTypeId) {
    return (
      <CustomizedDataGrid
        rows={[]}
        columns={columns}
        loading={false}
        label="Job Counters"
        showToolbar
      />
    );
  }

  const getAll = useCallback(() => {
    return tblCompJobCounter.getAll({
      filter: { counterTypeId },
      include: { tblCompJob: true, tblCompCounter: true },
    });
  }, [counterTypeId]);

  const { rows, loading, fetchData } = useDataGrid(
    getAll,
    tblCompJobCounter.deleteById,
    "compJobCounterId"
  );

  return (
    <CustomizedDataGrid
      rows={rows}
      columns={columns}
      loading={loading}
      label={label || undefined}
      showToolbar
      onRefreshClick={fetchData}
      getRowId={(row) => row.compJobCounterId}
    />
  );
}
