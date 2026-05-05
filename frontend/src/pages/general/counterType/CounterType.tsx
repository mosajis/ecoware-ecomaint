import Splitter from "@/shared/components/Splitter/Splitter";
import DataGrid from "@/shared/components/dataGrid/DataGrid";
import CounterTypeTabs from "./CounterTypeTabs";
import CounterTypeUpsert from "./CounterTypeUpsert";
import { tblCounterType, TypeTblCounterType } from "@/core/api/generated/api";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { useUpsertDialog } from "@/shared/hooks/useUpsertDialog";
import { columns, getRowId } from "./CounterTypeColumns";
import { useCallback, useState } from "react";

export default function PageCounterType() {
  const [label, setLabel] = useState<string | null>(null);
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

  const { rows, loading, handleDelete, handleRefresh } = useDataGrid(
    tblCounterType.getAll,
    tblCounterType.deleteById,
    "counterTypeId",
  );

  const { openCreate, openEdit, openView, dialogProps } = useUpsertDialog({
    onSuccess: handleRefresh,
  });
  const handleRowClick = useCallback(({ row }: { row: TypeTblCounterType }) => {
    setSelectedRowId(row.counterTypeId);
    setLabel(row.name);
  }, []);

  return (
    <Splitter initialPrimarySize="35%">
      <DataGrid
        showToolbar
        disableColumns
        disableExport
        rowSelection
        label={"Counter Type"}
        elementId={500}
        rows={rows}
        columns={columns}
        loading={loading}
        onRowClick={handleRowClick}
        onAddClick={openCreate}
        onEditClick={openEdit}
        onDeleteClick={handleDelete}
        onRefreshClick={handleRefresh}
        onDoubleClick={openView}
        getRowId={getRowId}
      >
        <CounterTypeUpsert entityName={"Counter Type"} {...dialogProps} />
      </DataGrid>

      <CounterTypeTabs label={label} counterTypeId={selectedRowId} />
    </Splitter>
  );
}
