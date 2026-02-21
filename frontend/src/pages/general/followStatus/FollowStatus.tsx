import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import FollowStatusUpsert from "./FollowStatusUpsert";
import { useCallback, useState } from "react";
import { tblFollowStatus } from "@/core/api/generated/api";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { useDialogs } from "@/shared/hooks/useDialogs";
import { columns, getRowId } from "./FollowStatusColumns";

export default function PageFollowStatus() {
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [mode, setMode] = useState<"create" | "update">("create");
  const { dialogs, openDialog, closeDialog } = useDialogs({
    upsert: false,
  });

  // === useDataGrid ===
  const { rows, loading, handleRefresh, handleDelete } = useDataGrid(
    tblFollowStatus.getAll,
    tblFollowStatus.deleteById,
    "followStatusId",
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
        label="Follow Status"
        rows={rows}
        columns={columns}
        loading={loading}
        getRowId={getRowId}
        onAddClick={handleCreate}
        onRefreshClick={handleRefresh}
        onDeleteClick={handleDelete}
        onEditClick={handleEdit}
        onDoubleClick={handleEdit}
      />

      <FollowStatusUpsert
        open={dialogs.upsert}
        mode={mode}
        recordId={selectedRowId}
        onClose={() => closeDialog("upsert")}
        onSuccess={handleRefresh}
      />
    </>
  );
}
