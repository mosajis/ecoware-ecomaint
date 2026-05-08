import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { useCallback } from "react";
import { tblCompTypeCounter } from "@/core/api/generated/api";
import { columns, getRowId } from "./TabCompTypeColumn";

interface TabCompTypeCounterProps {
  counterTypeId: number | null | undefined;
  label?: string;
}

export default function TabCompTypeCounter(props: TabCompTypeCounterProps) {
  const { counterTypeId, label } = props;

  const getAll = useCallback(() => {
    return tblCompTypeCounter.getAll({
      filter: { counterTypeId },
      include: { tblCompType: true },
    });
  }, [counterTypeId]);

  const { rows, loading, fetchData } = useDataGrid(
    getAll,
    tblCompTypeCounter.deleteById,
    "compTypeCounterId",
    !!counterTypeId,
  );

  return (
    <CustomizedDataGrid
      disableEdit
      disableDelete
      disableRowSelectionOnClick
      rows={rows}
      columns={columns}
      loading={loading}
      label={label}
      showToolbar={!!label}
      onRefreshClick={fetchData}
      getRowId={getRowId}
    />
  );
}
