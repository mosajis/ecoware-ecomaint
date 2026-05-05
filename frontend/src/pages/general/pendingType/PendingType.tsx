import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import PendingTypeUpsert from "./PendingTypeUpsert";

import { tblPendingType } from "@/core/api/generated/api";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { useUpsertDialog } from "@/shared/hooks/useUpsertDialog";

import { columns, getRowId } from "./PendingTypeColumns";

export default function PagePendingType() {
  const { rows, loading, handleRefresh, handleDelete } = useDataGrid(
    tblPendingType.getAll,
    tblPendingType.deleteById,
    "pendTypeId",
  );

  const { openCreate, openEdit, openView, dialogProps } = useUpsertDialog({
    onSuccess: handleRefresh,
  });

  return (
    <CustomizedDataGrid
      showToolbar
      label="Pending Type"
      elementId={800}
      rows={rows}
      columns={columns}
      loading={loading}
      onDeleteClick={handleDelete}
      onEditClick={openEdit}
      onDoubleClick={openView}
      onAddClick={openCreate}
      onRefreshClick={handleRefresh}
      getRowId={getRowId}
    >
      <PendingTypeUpsert entityName="Pending Type" {...dialogProps} />
    </CustomizedDataGrid>
  );
}
