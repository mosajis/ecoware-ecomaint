import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import EmployeeUpsert from "./EmployeeUpsert";
import { useState, useCallback } from "react";
import { tblEmployee, TypeTblEmployee } from "@/core/api/generated/api";
import { GridColDef } from "@mui/x-data-grid";
import { useDataGrid } from "@/shared/hooks/useDataGrid";

const getRowId = (row: TypeTblEmployee) => row.employeeId;

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
  { field: "orderNo", headerName: "Order No", width: 80 },
];

export default function PageEmployee() {
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"create" | "update">("create");
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

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
    handleUpsertOpen();
  }, []);

  const handleEdit = useCallback((rowId: number) => {
    setSelectedRowId(rowId);
    setMode("update");
    handleUpsertOpen();
  }, []);

  const handleUpsertClose = useCallback(() => {
    setOpenForm(false);
  }, []);

  const handleUpsertOpen = useCallback(() => {
    setOpenForm(true);
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
        open={openForm}
        mode={mode}
        recordId={selectedRowId}
        onClose={handleUpsertClose}
        onSuccess={handleRefresh}
      />
    </>
  );
}
