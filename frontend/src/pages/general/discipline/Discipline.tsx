import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { useState, useCallback } from "react";
import { tblDiscipline, TypeTblDiscipline } from "@/core/api/generated/api";
import { dataGridActionColumn } from "@/shared/components/dataGrid/DataGridActionsColumn";
import { GridColDef } from "@mui/x-data-grid";
import { useDataGrid } from "../_hooks/useDataGrid";
import DisciplineFormDialog from "./DisciplineFormDialog";

export default function DisciplineList() {
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"create" | "update">("create");
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

  const getAll = useCallback(
    () => tblDiscipline.getAll({ paginate: false }),
    []
  );

  // === Hook ===
  const { rows, loading, handleDelete, handleFormSuccess, handleRefresh } =
    useDataGrid(getAll, tblDiscipline.deleteById, "discId");

  // === Handlers ===
  const handleCreate = useCallback(() => {
    setSelectedRowId(null);
    setMode("create");
    setOpenForm(true);
  }, []);

  const handleEdit = useCallback((row: TypeTblDiscipline) => {
    setSelectedRowId(row.discId);
    setMode("update");
    setOpenForm(true);
  }, []);

  const handleRefreshClicked = useCallback(() => {
    handleRefresh();
  }, [handleRefresh]);

  // === Columns ===
  const columns: GridColDef<TypeTblDiscipline>[] = [
    { field: "name", headerName: "Name", flex: 1 },
    dataGridActionColumn({ onEdit: handleEdit, onDelete: handleDelete }),
  ];

  return (
    <>
      <CustomizedDataGrid
        loading={loading}
        showToolbar
        label="Discipline"
        rows={rows}
        columns={columns}
        onAddClick={handleCreate}
        onRefreshClick={handleRefreshClicked}
        getRowId={(row) => row.discId}
      />

      <DisciplineFormDialog
        open={openForm}
        mode={mode}
        recordId={selectedRowId}
        onClose={() => setOpenForm(false)}
        onSuccess={handleFormSuccess}
      />
    </>
  );
}
