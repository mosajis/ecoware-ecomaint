import DataGrid from "@/shared/components/dataGrid/DataGrid";
import EmployeeUpsert from "./EmployeeUpsert";
import { useCallback } from "react";
import { tblEmployee } from "@/core/api/generated/api";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { useUpsertDialog } from "@/shared/hooks/useUpsertDialog";
import { columns, getRowId } from "./EmployeeColumns";

export default function PageEmployee() {
  const getAll = useCallback(
    () =>
      tblEmployee.getAll({
        include: {
          tblDiscipline: true,
        },
      }),
    [],
  );

  const { rows, loading, handleDelete, handleRefresh } = useDataGrid(
    getAll,
    tblEmployee.deleteById,
    "employeeId",
  );

  const { openCreate, openEdit, dialogProps, openView } = useUpsertDialog({
    onSuccess: handleRefresh,
  });

  const label = "Employee";

  return (
    <DataGrid
      showToolbar
      disableRowNumber
      label={label}
      elementId={300}
      loading={loading}
      rows={rows}
      columns={columns}
      onAddClick={openCreate}
      onRefreshClick={handleRefresh}
      onDeleteClick={handleDelete}
      onEditClick={openEdit}
      onDoubleClick={openView}
      getRowId={getRowId}
    >
      <EmployeeUpsert entityName={label} {...dialogProps} />
    </DataGrid>
  );
}
