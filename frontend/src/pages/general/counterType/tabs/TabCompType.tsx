import React, { useCallback } from "react";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import {
  tblCompTypeCounter,
  TypeTblCompTypeCounter,
} from "@/core/api/generated/api";
import { GridColDef } from "@mui/x-data-grid";
import { useDataGrid } from "@/shared/hooks/useDataGrid";

interface TabCompTypeCounterProps {
  counterTypeId: number | null | undefined;
  label?: string | null;
}

// ---- Columns (مطابق نیاز میتونی تغییر بدی) ----
const columns: GridColDef<TypeTblCompTypeCounter>[] = [
  {
    field: "code",
    headerName: "Code",
    width: 120,
    valueGetter: (_, row) => row.tblCompType?.compTypeNo,
  },
  {
    field: "name",
    headerName: "Name",
    flex: 1,
    valueGetter: (_, row) => row?.tblCompType?.compName,
  },
];

export default function TabCompTypeCounter(props: TabCompTypeCounterProps) {
  const { counterTypeId, label } = props;

  // اگر مقدار نداشت جدول خالی نمایش بده
  if (!counterTypeId) {
    return (
      <CustomizedDataGrid
        rows={[]}
        columns={columns}
        loading={false}
        label="Comp Type Counter"
        showToolbar
      />
    );
  }

  const getAll = useCallback(() => {
    return tblCompTypeCounter.getAll({
      filter: { counterTypeId },
      include: { tblCompType: true },
    });
  }, [counterTypeId]);

  const { rows, loading, fetchData } = useDataGrid(
    getAll,
    tblCompTypeCounter.deleteById,
    "compTypeCounterId"
  );

  return (
    <CustomizedDataGrid
      rows={rows}
      columns={columns}
      loading={loading}
      label={label || undefined}
      showToolbar
      onRefreshClick={fetchData}
      getRowId={(row) => row.compTypeCounterId}
    />
  );
}
