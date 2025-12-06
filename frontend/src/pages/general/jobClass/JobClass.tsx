import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import JobClassFormDialog from "./JobClassFormDialog";
import { useState, useCallback, useMemo } from "react";
import { tblJobClass, TypeTblJobClass } from "@/core/api/generated/api";
import { GridColDef } from "@mui/x-data-grid";
import { dataGridActionColumn } from "@/shared/components/dataGrid/DataGridActionsColumn";
import { useDataGrid } from "@/shared/hooks/useDataGrid";

export default function PageJobClass() {
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"create" | "update">("create");

  // === useDataGrid ===
  const { rows, loading, handleRefresh, handleDelete, handleFormSuccess } =
    useDataGrid(tblJobClass.getAll, tblJobClass.deleteById, "jobClassId");

  // === Handlers ===
  const handleCreate = useCallback(() => {
    setSelectedRowId(null);
    setMode("create");
    setOpenForm(true);
  }, []);

  const handleEdit = useCallback((row: TypeTblJobClass) => {
    setSelectedRowId(row.jobClassId);
    setMode("update");
    setOpenForm(true);
  }, []);

  // === Columns ===
  const columns = useMemo<GridColDef<TypeTblJobClass>[]>(
    () => [
      { field: "code", headerName: "Code", width: 60 },
      { field: "name", headerName: "Name", flex: 1 },
      dataGridActionColumn({ onEdit: handleEdit, onDelete: handleDelete }),
    ],
    [handleEdit, handleDelete]
  );

  return (
    <>
      <CustomizedDataGrid
        label="Job Class"
        showToolbar
        rows={rows}
        columns={columns}
        loading={loading}
        getRowId={(row) => row.jobClassId}
        onAddClick={handleCreate}
        onRefreshClick={handleRefresh}
      />

      <JobClassFormDialog
        open={openForm}
        mode={mode}
        recordId={selectedRowId}
        onClose={() => setOpenForm(false)}
        onSuccess={(record) => {
          handleFormSuccess(record);
          setOpenForm(false);
        }}
      />
    </>
  );
}
