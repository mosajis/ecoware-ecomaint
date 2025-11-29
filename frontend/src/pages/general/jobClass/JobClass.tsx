import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import JobClassFormDialog from "./JobClassFormDialog";
import { useState, useCallback, useMemo } from "react";
import { Box } from "@mui/material";
import { tblJobClass, TypeTblJobClass } from "@/core/api/generated/api";
import { GridColDef } from "@mui/x-data-grid";
import { dataGridActionColumn } from "@/shared/components/dataGrid/DataGridActionsColumn";
import { useDataGrid } from "../_hooks/useDataGrid";

export default function JobClassPage() {
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"create" | "update">("create");

  // === useDataGrid ===
  const { rows, loading, fetchData, handleDelete, handleFormSuccess } =
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
      { field: "code", headerName: "Code", width: 120 },
      { field: "name", headerName: "Name", flex: 2 },
      dataGridActionColumn({ onEdit: handleEdit, onDelete: handleDelete }),
    ],
    [handleEdit, handleDelete]
  );

  return (
    <Box height="100%">
      <CustomizedDataGrid
        label="Job Class"
        showToolbar
        rows={rows}
        columns={columns}
        loading={loading}
        getRowId={(row) => row.jobClassId}
        onAddClick={handleCreate}
        onRefreshClick={fetchData}
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
    </Box>
  );
}
