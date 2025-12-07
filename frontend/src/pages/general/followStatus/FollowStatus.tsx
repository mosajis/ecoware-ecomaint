import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import FollowStatusFormDialog from "./FollowStatusFormDialog";
import { useCallback, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import { tblFollowStatus, TypeTblFollowStatus } from "@/core/api/generated/api";
import { GridColDef } from "@mui/x-data-grid";
import { dataGridActionColumn } from "@/shared/components/dataGrid/DataGridActionsColumn";
import { useDataGrid } from "@/shared/hooks/useDataGrid";

export default function PageFollowStatus() {
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"create" | "update">("create");

  // === useDataGrid ===
  const { rows, loading, handleRefresh, handleDelete, handleFormSuccess } =
    useDataGrid(
      tblFollowStatus.getAll,
      tblFollowStatus.deleteById,
      "followStatusId"
    );

  // === Handlers ===
  const handleCreate = useCallback(() => {
    setSelectedRowId(null);
    setMode("create");
    setOpenForm(true);
  }, []);

  const handleEdit = useCallback((row: TypeTblFollowStatus) => {
    setSelectedRowId(row.followStatusId);
    setMode("update");
    setOpenForm(true);
  }, []);

  // === Columns ===
  const columns = useMemo<GridColDef<TypeTblFollowStatus>[]>(
    () => [
      { field: "fsName", headerName: "Name", flex: 2 },
      { field: "fsDesc", headerName: "Description", flex: 3 },
      dataGridActionColumn({ onEdit: handleEdit, onDelete: handleDelete }),
    ],
    [handleEdit, handleDelete]
  );

  return (
    <>
      <CustomizedDataGrid
        label="Follow Status"
        showToolbar
        rows={rows}
        columns={columns}
        loading={loading}
        getRowId={(row) => row.followStatusId}
        onAddClick={handleCreate}
        onRefreshClick={handleRefresh}
      />

      <FollowStatusFormDialog
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
