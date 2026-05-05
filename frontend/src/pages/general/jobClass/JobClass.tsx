import DataGrid from "@/shared/components/dataGrid/DataGrid";
import JobClassUpsert from "./JobClassUpsert";
import { tblJobClass } from "@/core/api/generated/api";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { useUpsertDialog } from "@/shared/hooks/useUpsertDialog";
import { columns, getRowId } from "./JobClassColumns";

export default function PageJobClass() {
  const { rows, loading, handleRefresh, handleDelete } = useDataGrid(
    tblJobClass.getAll,
    tblJobClass.deleteById,
    "jobClassId",
  );

  const { openCreate, openEdit, openView, dialogProps } = useUpsertDialog({
    onSuccess: handleRefresh,
  });

  return (
    <DataGrid
      showToolbar
      elementId={900}
      label="Job Class"
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
      <JobClassUpsert entityName="Job Class" {...dialogProps} />
    </DataGrid>
  );
}
