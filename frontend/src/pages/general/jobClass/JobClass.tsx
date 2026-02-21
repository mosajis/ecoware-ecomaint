import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import JobClassUpsert from "./JobClassUpsert";
import { useState, useCallback } from "react";
import { tblJobClass } from "@/core/api/generated/api";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { columns, getRowId } from "./JobClassColumns";
import { useDialogs } from "@/shared/hooks/useDialogs";

export default function PageJobClass() {
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [mode, setMode] = useState<"create" | "update">("create");
  const { dialogs, openDialog, closeDialog } = useDialogs({
    upsert: false,
  });

  // === useDataGrid ===
  const { rows, loading, handleRefresh, handleDelete } = useDataGrid(
    tblJobClass.getAll,
    tblJobClass.deleteById,
    "jobClassId",
  );

  // === Handlers ===
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
        label="Job Class"
        rows={rows}
        columns={columns}
        loading={loading}
        getRowId={getRowId}
        onAddClick={handleCreate}
        onEditClick={handleEdit}
        onDoubleClick={handleEdit}
        onDeleteClick={handleDelete}
        onRefreshClick={handleRefresh}
      />

      <JobClassUpsert
        open={dialogs.upsert}
        mode={mode}
        recordId={selectedRowId}
        onClose={() => closeDialog("upsert")}
        onSuccess={handleRefresh}
      />
    </>
  );
}
