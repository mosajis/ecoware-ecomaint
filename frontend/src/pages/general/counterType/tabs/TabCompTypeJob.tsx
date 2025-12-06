import React, { useCallback } from "react";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import {
  tblCompTypeCounter,
  tblCompTypeJobCounter,
  tblJobDescription,
  TypeTblCompTypeJobCounter,
} from "@/core/api/generated/api";
import { GridColDef } from "@mui/x-data-grid";
import { useDataGrid } from "../../hooks/useDataGrid";

interface TabCompTypeJobCounterProps {
  counterTypeId: number | null | undefined;
  label?: string | null;
}

const columns: GridColDef<TypeTblCompTypeJobCounter>[] = [
  {
    field: "jobDescId",
    headerName: "Job Desc",
    flex: 1,
    valueGetter: (_, row) =>
      row.tblCompTypeJob?.tblJobDescription?.jobDescTitle,
  },
  {
    field: "maintTypeId",
    headerName: "Maint Type (set Rel)",
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
    field: "compTypeCounter",
    headerName: "Counter Type",
    flex: 1,
    valueGetter: (_, row) => row?.tblCompTypeCounter?.tblCompType?.compName,
  },
];

export default function TabCompTypeJobCounter(
  props: TabCompTypeJobCounterProps
) {
  const { counterTypeId, label } = props;

  const getAll = useCallback(async () => {
    return tblCompTypeJobCounter.getAll({
      filter: {
        tblCompTypeCounter: {
          counterTypeId,
        },
      },
      include: {
        tblCompTypeCounter: {
          include: { tblCompType: true },
        },
        tblCompTypeJob: {
          include: {
            tblJobDescription: true,
          },
        },
      },
    });
  }, [counterTypeId]);

  const { rows, loading, fetchData } = useDataGrid(
    getAll,
    tblCompTypeJobCounter.deleteById,
    "compTypeJobCounterId",
    !!counterTypeId
  );

  return (
    <CustomizedDataGrid
      rows={rows}
      columns={columns}
      loading={loading}
      label={label || undefined}
      showToolbar
      onRefreshClick={fetchData}
      getRowId={(row) => row.compTypeJobCounterId}
    />
  );
}
