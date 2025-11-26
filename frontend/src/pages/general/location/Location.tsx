import Splitter from "@/shared/components/Splitter";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import CustomizedTree from "@/shared/components/tree/Tree";
import LocationFormDialog from "./LocationFormDialog";
import ConfirmDialog from "@/shared/components/ConfirmDialog";
import { useState, useCallback } from "react";
import { tblLocation, TypeTblLocation } from "@/core/api/generated/api";
import { dataGridActionColumn } from "@/shared/components/dataGrid/DataGridActionsColumn";
import { GridColDef } from "@mui/x-data-grid";
import { useDataTree } from "../_hooks/useDataTree";

export default function LocationListPage() {
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"create" | "update">("create");
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

  // Confirm delete states
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  // === Mapping Transformer ===
  const mapper = useCallback(
    (row: TypeTblLocation) => ({
      id: row.locationId.toString(),
      label: row.name ?? "",
      parentId: row.parentLocationId?.toString() ?? null,
      data: row,
    }),
    []
  );

  // === useDataTree ===
  const {
    rows,
    treeItems,
    loading,
    handleDelete,
    handleFormSuccess,
    handleRefresh,
  } = useDataTree(
    useCallback(() => tblLocation.getAll({ paginate: false }), []),
    tblLocation.deleteById,
    "locationId",
    mapper
  );

  // === Handlers ===
  const handleCreate = () => {
    setSelectedRowId(null);
    setMode("create");
    setOpenForm(true);
  };

  const handleEdit = (row: TypeTblLocation) => {
    setSelectedRowId(row.locationId);
    setMode("update");
    setOpenForm(true);
  };

  // === ONE unified delete handler (SAFE) ===
  const openDeleteModal = (id: number) => {
    setDeleteTargetId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteTargetId == null) return;

    await handleDelete({ locationId: deleteTargetId } as any);
    setConfirmOpen(false);
    setDeleteTargetId(null);
  };

  const cancelDelete = () => {
    setConfirmOpen(false);
    setDeleteTargetId(null);
  };

  // === Columns ===
  const columns: GridColDef<TypeTblLocation>[] = [
    { field: "locationCode", headerName: "Code", width: 120 },
    { field: "locationId", headerName: "Id", width: 100 },
    { field: "parentLocationId", headerName: "ParentId", width: 120 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "orderId", headerName: "Order", width: 80 },
    dataGridActionColumn({
      onEdit: handleEdit,
      onDelete: handleDelete,
    }),
  ];

  return (
    <>
      <Splitter>
        {/* === TREE VIEW === */}
        <CustomizedTree
          onRefresh={handleRefresh}
          label="Tree View"
          items={treeItems}
          loading={loading}
          onAddClick={handleCreate}
          onEditClick={(id) => handleEdit({ locationId: id } as any)}
          onDeleteClick={(id) => openDeleteModal(Number(id))} // SAFE
        />

        {/* === GRID VIEW === */}
        <CustomizedDataGrid
          showToolbar
          label="List View"
          loading={loading}
          rows={rows}
          columns={columns}
          onRefreshClick={handleRefresh}
          onAddClick={handleCreate}
          getRowId={(row) => row.locationId}
        />
      </Splitter>

      {/* === FORM === */}
      <LocationFormDialog
        open={openForm}
        mode={mode}
        recordId={selectedRowId}
        onClose={() => setOpenForm(false)}
        onSuccess={handleFormSuccess}
      />

      {/* === CONFIRM DELETE === */}
      <ConfirmDialog
        open={confirmOpen}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
        title="Delete Location"
        message="Are you sure you want to delete this location?"
      />
    </>
  );
}
