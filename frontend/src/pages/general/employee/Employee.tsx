import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { useState, useCallback } from "react";
import { tblEmployee, TypeTblEmployee } from "@/core/api/generated/api";
import { dataGridActionColumn } from "@/shared/components/dataGrid/DataGridActionsColumn";
import { GridColDef } from "@mui/x-data-grid";
import { useDataGrid } from "../_hooks/useDataGrid";
import EmployeeFormDialog from "./EmployeeFormDialog";

export default function EmployeeDiscipline() {
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"create" | "update">("create");
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

  // === Mapping & getId (برای DataGrid) ===
  const getId = useCallback((row: TypeTblEmployee) => row.employeeId, []);

  // === Hook ===
  const { rows, loading, handleDelete, handleFormSuccess, handleRefresh } =
    useDataGrid<TypeTblEmployee, number>(tblEmployee, getId);

  // === Handlers ===
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

  // === Columns ===
  const columns: GridColDef<TypeTblEmployee>[] = [
    { field: "code", headerName: "Code", width: 100 },
    { field: "lastName", headerName: "Last Name", flex: 1 },
    { field: "firstName", headerName: "First Name", flex: 1 },
    { field: "address", headerName: "Address", flex: 1 },
    { field: "discipline", headerName: "Discipline", flex: 1 },
    { field: "position", headerName: "Position", flex: 1 },
    { field: "hrsAvailWeek", headerName: "Hrs Avail/Week", flex: 1 },
    dataGridActionColumn({ onEdit: handleEdit, onDelete: handleDelete }),
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
    </>
  );
}
