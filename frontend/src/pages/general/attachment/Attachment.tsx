import DataGrid from "@/shared/components/dataGrid/DataGrid";
import Upsert from "./AttachmentUpsert";

import { tblAttachment } from "@/core/api/generated/api";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { columns, getRowId } from "./AttachmentColumns";
import { useUpsertDialog } from "@/shared/hooks/useUpsertDialog";
import { useCallback } from "react";

export default function PageAttachment() {
  const getAll = useCallback(() => {
    return tblAttachment.getAll({
      include: {
        tblAttachmentType: true,
        tblEmployee: true,
      },
    });
  }, []);

  const { rows, loading, handleDelete, handleRefresh } = useDataGrid(
    getAll,
    tblAttachment.deleteById,
    "attachmentId",
  );

  const { openCreate, openEdit, openView, dialogProps } = useUpsertDialog({
    onSuccess: handleRefresh,
  });

  const label = "Attachment";

  return (
    <DataGrid
      showToolbar
      disableRowNumber
      disableEdit
      elementId={1200}
      label={label}
      rows={rows}
      columns={columns}
      loading={loading}
      onRefreshClick={handleRefresh}
      onDeleteClick={handleDelete}
      onAddClick={openCreate}
      getRowId={getRowId}
    >
      <Upsert entityName={label} {...dialogProps} />
    </DataGrid>
  );
}
