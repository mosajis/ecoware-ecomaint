import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import FollowStatusUpsert from "./FollowStatusUpsert";

import { tblFollowStatus } from "@/core/api/generated/api";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { useUpsertDialog } from "@/shared/hooks/useUpsertDialog";

import { columns, getRowId } from "./FollowStatusColumns";

export default function PageFollowStatus() {
  const { rows, loading, handleRefresh, handleDelete } = useDataGrid(
    tblFollowStatus.getAll,
    tblFollowStatus.deleteById,
    "followStatusId",
  );

  const { openCreate, openEdit, openView, dialogProps } = useUpsertDialog({
    onSuccess: handleRefresh,
  });

  return (
    <CustomizedDataGrid
      showToolbar
      elementId={700}
      label="Follow Status"
      rows={rows}
      columns={columns}
      loading={loading}
      getRowId={getRowId}
      onAddClick={openCreate}
      onEditClick={openEdit}
      onDeleteClick={handleDelete}
      onRefreshClick={handleRefresh}
      onDoubleClick={openView}
    >
      <FollowStatusUpsert entityName="Follow Status" {...dialogProps} />
    </CustomizedDataGrid>
  );
}
