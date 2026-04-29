import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import PendingTypeUpsert from "./PendingTypeUpsert";
import { useState, useCallback } from "react";
import { tblPendingType } from "@/core/api/generated/api";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { useDialogs } from "@/shared/hooks/useDialogs";
import { columns, getRowId } from "./PendingTypeColumns";

export default function PagePendingType() {
  const [mode, setMode] = useState<"create" | "update">("create");
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

  const { dialogs, openDialog, closeDialog } = useDialogs({
    upsert: false,
  });

  const { rows, loading, handleRefresh, handleDelete } = useDataGrid(
    tblPendingType.getAll,
    tblPendingType.deleteById,
    "pendTypeId",
  );

  const handleCreate = useCallback(() => {
    setSelectedRowId(null);
    setMode("create");
    openDialog("upsert");
  }, []);

  const handleEdit = useCallback((rowId: number) => {
    setSelectedRowId(rowId);
    setMode("update");
    openDialog("upsert");
  }, []);

  return (
    <>
      <CustomizedDataGrid
        showToolbar
        label="Pending Type"
        elementId={800}
        rows={rows}
        columns={columns}
        loading={loading}
        onDeleteClick={handleDelete}
        onEditClick={handleEdit}
        onDoubleClick={handleEdit}
        onAddClick={handleCreate}
        getRowId={getRowId}
      />

      <PendingTypeUpsert
        open={dialogs.upsert}
        mode={mode}
        recordId={selectedRowId}
        onClose={() => closeDialog("upsert")}
        onSuccess={handleRefresh}
      />
    </>
  );
}
