import DataGrid from "@/shared/components/dataGrid/DataGrid";
import DisciplineUpsert from "./DisciplineUpsert";
import { useCallback } from "react";
import { tblDiscipline } from "@/core/api/generated/api";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { useUpsertDialog } from "@/shared/hooks/useUpsertDialog";
import { columns, getRowId } from "./DisciplineColumns";

export default function PageDiscipline() {
  const { rows, loading, handleDelete, handleRefresh } = useDataGrid(
    tblDiscipline.getAll,
    tblDiscipline.deleteById,
    "discId",
  );

  const { openCreate, openEdit, openView, dialogProps } = useUpsertDialog({
    onSuccess: handleRefresh,
  });
  const label = "Discipline";

  return (
    <DataGrid
      showToolbar
      elementId={400}
      loading={loading}
      label={label}
      rows={rows}
      columns={columns}
      onAddClick={openCreate}
      onEditClick={openEdit}
      onDeleteClick={handleDelete}
      onRefreshClick={handleRefresh}
      onDoubleClick={openView}
      getRowId={getRowId}
    >
      <DisciplineUpsert entityName={label} {...dialogProps} />
    </DataGrid>
  );
}
