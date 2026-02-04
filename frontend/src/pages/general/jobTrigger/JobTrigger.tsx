import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import Upsert from "./JobTriggerUpsert";
import { type GridColDef } from "@mui/x-data-grid";
import { useCallback, useState } from "react";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { tblJobTrigger, TypeTblJobTrigger } from "@/core/api/generated/api";

const getRowId = (row: TypeTblJobTrigger) => row.jobTriggerId;

const columns: GridColDef<TypeTblJobTrigger>[] = [
  { field: "descr", headerName: "Description", flex: 1 },
  { field: "orderNo", headerName: "Order No", width: 100 },
];

export default function PageJobTrigger() {
  const [selectedRowId, setSelectedRowId] = useState<null | number>(null);
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"create" | "update">("create");

  // === useDataGrid ===
  const { rows, loading, handleDelete, handleRefresh } = useDataGrid(
    tblJobTrigger.getAll,
    tblJobTrigger.deleteById,
    "jobTriggerId",
  );

  // === Handlers ===
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
        label="Job Triggers"
        onAddClick={handleCreate}
        onRefreshClick={handleRefresh}
        onDeleteClick={handleDelete}
        onEditClick={handleEdit}
        onDoubleClick={handleEdit}
        rows={rows}
        columns={columns}
        loading={loading}
        getRowId={getRowId}
      />

      <Upsert
        open={openForm}
        mode={mode}
        recordId={selectedRowId}
        onClose={handleUpsertClose}
        onSuccess={handleRefresh}
      />
    </>
  );
}
