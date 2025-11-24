import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import EmployeeFormDialog from "./EmployeeFormDialog";
import ConfirmDialog from "@/shared/components/ConfirmDialog";
import { useState, useCallback } from "react";
import { tblEmployee, TypeTblEmployee } from "@/core/api/generated/api";
import { dataGridActionColumn } from "@/shared/components/dataGrid/DataGridActionsColumn";
import { GridColDef } from "@mui/x-data-grid";
import { useDataGrid } from "../_hooks/useDataGrid";

export default function EmployeeDiscipline() {
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"create" | "update">("create");
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

  // Confirm delete states
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  // === getId function
  const getId = useCallback((row: TypeTblEmployee) => row.employeeId, []);

  const getAll = useCallback(() => tblEmployee.getAll({ paginate: false }), []);

  // === useDataGrid hook
  const { rows, loading, handleDelete, handleFormSuccess, handleRefresh } =
    useDataGrid(getAll, tblEmployee.deleteById, "employeeId");

  // === Handlers
  const handleCreate = useCallback(() => {
    setSelectedRowId(null);
    setMode("create");
    setOpenForm(true);
  }, []);

  const handleEdit = useCallback((row: TypeTblEmployee) => {
    setSelectedRowId(row.employeeId);
    setMode("update");
    setOpenForm(true);
  }, []);

  const handleRefreshClicked = useCallback(() => {
    handleRefresh();
  }, [handleRefresh]);

  const openDeleteModal = (id: number) => {
    setDeleteTargetId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteTargetId == null) return;

    setDeleting(true);
    try {
      await handleDelete({ employeeId: deleteTargetId } as any);
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
      setDeleteTargetId(null);
    }
  };

  const cancelDelete = () => {
    setConfirmOpen(false);
    setDeleteTargetId(null);
  };

  // === Columns
  const columns: GridColDef<TypeTblEmployee>[] = [
    { field: "code", headerName: "Code", width: 100 },
    { field: "lastName", headerName: "Last Name", flex: 1 },
    { field: "firstName", headerName: "First Name", flex: 1 },
    { field: "address", headerName: "Address", flex: 1 },
    { field: "discipline", headerName: "Discipline", flex: 1 },
    { field: "position", headerName: "Position", flex: 1 },
    { field: "hrsAvailWeek", headerName: "Hrs Avail/Week", flex: 1 },
    dataGridActionColumn({
      onEdit: handleEdit,
      onDelete: (row) => openDeleteModal(row.employeeId),
    }),
  ];

  return (
    <>
      <CustomizedDataGrid
        loading={loading}
        showToolbar
        label="Employee"
        rows={rows}
        columns={columns}
        onAddClick={handleCreate}
        onRefreshClick={handleRefreshClicked}
        getRowId={getId}
      />

      <EmployeeFormDialog
        open={openForm}
        mode={mode}
        recordId={selectedRowId}
        onClose={() => setOpenForm(false)}
        onSuccess={handleFormSuccess}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Delete Employee"
        message="Are you sure you want to delete this employee?"
        confirmText="Delete"
        confirmColor="error"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </>
  );
}
