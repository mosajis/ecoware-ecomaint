import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import EmployeeFormDialog from "./EmployeeFormDialog";
import { useState, useCallback } from "react";
import { tblEmployee, TypeTblEmployee } from "@/core/api/generated/api";
import { dataGridActionColumn } from "@/shared/components/dataGrid/DataGridActionsColumn";
import { GridColDef } from "@mui/x-data-grid";
import { useDataGrid } from "../_hooks/useDataGrid";

export default function PageEmployee() {
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"create" | "update">("create");
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

  // === getId function
  const getId = useCallback((row: TypeTblEmployee) => row.employeeId, []);

  const getAll = useCallback(
    () =>
      tblEmployee.getAll({
        include: {
          tblAddress: true,
          tblDiscipline: true,
        },
      }),
    []
  );

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

  // === Columns
  const columns: GridColDef<TypeTblEmployee>[] = [
    { field: "code", headerName: "Code", width: 60 },
    { field: "lastName", headerName: "Last Name", flex: 1 },
    { field: "firstName", headerName: "First Name", flex: 1 },
    {
      field: "address",
      headerName: "Address",
      flex: 1,
      valueGetter: (v, row) => row.tblAddress?.name,
    },
    {
      field: "discipline",
      headerName: "Discipline",
      flex: 1,
      valueGetter: (v, row) => row.tblDiscipline?.name,
    },
    { field: "available", headerName: "Hrs Avail/Week", width: 150 },
    dataGridActionColumn({
      onEdit: handleEdit,
      onDelete: handleDelete,
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
        onRefreshClick={handleRefresh}
        getRowId={getId}
      />

      <EmployeeFormDialog
        open={openForm}
        mode={mode}
        recordId={selectedRowId}
        onClose={() => setOpenForm(false)}
        onSuccess={handleFormSuccess}
      />
    </>
  );
}
