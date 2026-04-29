import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import AttachmentUpsert from "./AttachmentUpsert";
import { useCallback, useState } from "react";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { tblAttachment } from "@/core/api/generated/api";
import { useDialogs } from "@/shared/hooks/useDialogs";
import { columns, getRowId } from "./AttachmentColumns";

export default function PageAttachment() {
  const [selectedRowId, setSelectedRowId] = useState<null | number>(null);
  const [mode, setMode] = useState<"create" | "update">("create");
  const { dialogs, openDialog, closeDialog } = useDialogs({
    upsert: false,
  });

  const getAll = useCallback(
    () => tblAttachment.getAll({ include: { tblAttachmentType: true } }),
    [],
  );
  // === useDataGrid ===
  const { rows, loading, handleDelete, handleRefresh } = useDataGrid(
    getAll,
    tblAttachment.deleteById,
    "attachmentId",
  );

  // === Handlers ===
  const handleCreate = useCallback(() => {
    setSelectedRowId(null);
    setMode("create");
    openDialog("upsert");
  }, []);

  return (
    <>
      <CustomizedDataGrid
        showToolbar
        disableRowNumber
        disableEdit
        elementId={1200}
        label="Attachments"
        rows={rows}
        columns={columns}
        loading={loading}
        onDeleteClick={handleDelete}
        onAddClick={handleCreate}
        onRefreshClick={handleRefresh}
        getRowId={getRowId}
      />

      <AttachmentUpsert
        open={dialogs.upsert}
        mode={mode}
        recordId={selectedRowId}
        onClose={() => closeDialog("upsert")}
        onSuccess={handleRefresh}
      />
    </>
  );
}
