import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import EmployeeUpsert from "./EmployeeUpsert";
import { useState, useCallback } from "react";
import { tblEmployee } from "@/core/api/generated/api";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { useDialogs } from "@/shared/hooks/useDialogs";
import { columns, getRowId } from "./EmployeeColumns";

export default function PageEmployee() {
  const [mode, setMode] = useState<"create" | "update">("create");
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

  const { dialogs, openDialog, closeDialog } = useDialogs({
    upsert: false,
  });

  const getAll = useCallback(
    () =>
      tblEmployee.getAll({
        include: {
          tblAddress: true,
          tblDiscipline: true,
        },
      }),
    [],
  );

  // === useDataGrid hook
  const { rows, loading, handleDelete, handleRefresh } = useDataGrid(
    getAll,
    tblEmployee.deleteById,
    "employeeId",
  );

  // === Handlers
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
        disableRowNumber
        label="Employee"
        loading={loading}
        rows={rows}
        columns={columns}
        onAddClick={handleCreate}
        onRefreshClick={handleRefresh}
        onDeleteClick={handleDelete}
        onEditClick={handleEdit}
        onDoubleClick={handleEdit}
        getRowId={getRowId}
      />

      <EmployeeUpsert
        open={dialogs.upsert}
        mode={mode}
        recordId={selectedRowId}
        onClose={() => closeDialog("upsert")}
        onSuccess={handleRefresh}
      />
    </>
  );
}
