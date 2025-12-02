import React, { useCallback } from "react";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import {
  tblCompTypeCounter,
  TypeTblCompTypeCounter,
} from "@/core/api/generated/api";
import { GridColDef } from "@mui/x-data-grid";
import { useDataGrid } from "../../_hooks/useDataGrid";

interface TabCompTypeCounterProps {
  counterTypeId: number | null | undefined;
  label?: string | null;
}

// ---- Columns (مطابق نیاز میتونی تغییر بدی) ----
const columns: GridColDef<TypeTblCompTypeCounter>[] = [
  {
    field: "code",
    headerName: "Code",
    width: 60,
    valueGetter: (_, row) => row.tblCounterType?.code,
  },
  {
    field: "name",
    headerName: "Type No",
    flex: 1,
    valueGetter: (_, row) => row.tblCounterType?.name,
  },
  {
    field: "orderId",
    headerName: "Sort ID",
    width: 60,
    valueGetter: (_, row) => row.tblCounterType?.orderId,
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
      include: { tblCounterType: true },
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
