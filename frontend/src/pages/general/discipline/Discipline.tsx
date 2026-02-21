import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import DisciplineFormDialog from "./DisciplineUpsert";
import { useState, useCallback } from "react";
import { tblDiscipline } from "@/core/api/generated/api";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { useDialogs } from "@/shared/hooks/useDialogs";
import { columns, getRowId } from "./DisciplineColumns";

export default function PageDiscipline() {
  const [mode, setMode] = useState<"create" | "update">("create");
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

  const { dialogs, openDialog, closeDialog } = useDialogs({
    upsert: false,
  });

  // === Hook ===
  const { rows, loading, handleDelete, handleRefresh } = useDataGrid(
    tblDiscipline.getAll,
    tblDiscipline.deleteById,
    "discId",
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
        loading={loading}
        showToolbar
        label="Discipline"
        rows={rows}
        columns={columns}
        onDeleteClick={handleDelete}
        onEditClick={handleEdit}
        onDoubleClick={handleEdit}
        onAddClick={handleCreate}
        getRowId={getRowId}
      />

      <DisciplineFormDialog
        open={dialogs.upsert}
        mode={mode}
        recordId={selectedRowId}
        onClose={() => closeDialog("upsert")}
        onSuccess={handleRefresh}
      />
    </>
  );
}
