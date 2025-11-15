import Splitter from "@/shared/components/Splitter";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import CustomizedTree from "@/shared/components/tree/Tree";
import LocationFormDialog from "./LocationFormDialog";
import { useState, useCallback } from "react";
import { tblLocation, TypeTblLocation } from "@/core/api/generated/api";
import { dataGridActionColumn } from "@/shared/components/dataGrid/DataGridActionsColumn";
import { useTreeGrid } from "../_hooks/useTreeGrid";

export default function LocationListPage() {
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"create" | "update">("create");
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

  // === Mapping & getId ===
  const mapper = useCallback(
    (row: TypeTblLocation) => ({
      id: row.locationId.toString(),
      label: row.name ?? "",
      parentId: row.parentLocationId?.toString() ?? null,
      data: row,
    }),
    []
  );

  const getId = useCallback((row: TypeTblLocation) => row.locationId, []);

  // === Hook ===
  const {
    rows,
    treeItems,
    loading,
    handleDelete,
    handleFormSuccess,
    handleRefresh,
  } = useTreeGrid<TypeTblLocation, number>(tblLocation, mapper, getId);

  // === Handlers ===
  const handleCreate = useCallback(() => {
    setSelectedRowId(null);
    setMode("create");
    setOpenForm(true);
  }, []);

  const handleEdit = useCallback((row: TypeTblLocation) => {
    setSelectedRowId(row.locationId);
    setMode("update");
    setOpenForm(true);
  }, []);

  const handleRefreshClicked = useCallback(() => {
    handleRefresh(); // فراخوانی refresh hook
  }, [handleRefresh]);

  // === Columns ===
  const columns = [
    { field: "locationCode", headerName: "Code", width: 120 },
    { field: "locationId", headerName: "id", width: 120 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "orderId", headerName: "Order", width: 80 },
    dataGridActionColumn({ onEdit: handleEdit, onDelete: handleDelete }),
  ];

  return (
    <>
      <Splitter>
        <CustomizedTree label="Tree View" items={treeItems} loading={loading} />
        <CustomizedDataGrid
          loading={loading}
          showToolbar
          label="List View"
          rows={rows}
          columns={columns}
          onRefreshClick={handleRefreshClicked}
          onAddClick={handleCreate}
          getRowId={getId}
        />
      </Splitter>

      <LocationFormDialog
        open={openForm}
        mode={mode}
        recordId={selectedRowId}
        onClose={() => setOpenForm(false)}
        onSuccess={handleFormSuccess}
      />
    </>
  );
}
