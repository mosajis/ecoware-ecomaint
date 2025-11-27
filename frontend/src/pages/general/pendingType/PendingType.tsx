import { useState, useCallback, useMemo } from "react";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import PendingTypeFormDialog from "./PendingTypeFormDialog";
import { tblPendingType, TypeTblPendingType } from "@/core/api/generated/api";
import { GridColDef } from "@mui/x-data-grid";
import { dataGridActionColumn } from "@/shared/components/dataGrid/DataGridActionsColumn";
import { useDataGrid } from "../_hooks/useDataGrid";

export default function PendingTypePage() {
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"create" | "update">("create");
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

  const getAll = useCallback(
    () => tblPendingType.getAll({ paginate: false }),
    []
  );

  const { rows, loading, fetchData, handleDelete, handleFormSuccess } =
    useDataGrid(getAll, tblPendingType.deleteById, "pendTypeId");

  const handleCreate = useCallback(() => {
    setSelectedRowId(null);
    setMode("create");
    setOpenForm(true);
  }, []);

  const handleEdit = useCallback((row: TypeTblPendingType) => {
    setSelectedRowId(row.pendTypeId);
    setMode("update");
    setOpenForm(true);
  }, []);

  const columns: GridColDef<TypeTblPendingType>[] = useMemo(
    () => [
      { field: "pendTypeName", headerName: "Name", flex: 2 },
      { field: "parentId", headerName: "Parent Id", flex: 1 },
      { field: "groupId", headerName: "Group Id", flex: 1 },
      { field: "sortId", headerName: "Sort Id", flex: 1 },
      dataGridActionColumn({ onEdit: handleEdit, onDelete: handleDelete }),
    ],
    [handleEdit, handleDelete]
  );

  return (
    <>
      <CustomizedDataGrid
        rows={rows}
        columns={columns}
        label="Pending Type"
        showToolbar
        loading={loading}
        getRowId={(row) => row.pendTypeId}
        onAddClick={handleCreate}
        onRefreshClick={fetchData}
      />

      {openForm && (
        <PendingTypeFormDialog
          open={openForm}
          mode={mode}
          recordId={selectedRowId}
          onClose={() => setOpenForm(false)}
          onSuccess={(record) => {
            handleFormSuccess(record);
            setOpenForm(false);
          }}
        />
      )}
    </>
  );
}
