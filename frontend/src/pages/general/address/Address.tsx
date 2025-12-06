import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import AddressFormDialog from "./AddressFormDialog";
import { useCallback, useMemo, useState } from "react";
import { tblAddress, TypeTblAddress } from "@/core/api/generated/api";
import { type GridColDef } from "@mui/x-data-grid";
import { dataGridActionColumn } from "@/shared/components/dataGrid/DataGridActionsColumn";
import { useDataGrid } from "@/shared/hooks/useDataGrid";

export default function PageAddress() {
  const [selectedRowId, setSelectedRowId] = useState<null | number>(null);
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"create" | "update">("create");

  // === useDataGrid ===
  const { rows, loading, handleDelete, handleFormSuccess, handleRefresh } =
    useDataGrid(tblAddress.getAll, tblAddress.deleteById, "addressId");

  // === Handlers ===
  const handleCreate = useCallback(() => {
    setSelectedRowId(null);
    setMode("create");
    setOpenForm(true);
  }, []);

  const handleEdit = useCallback((row: TypeTblAddress) => {
    setSelectedRowId(row.addressId);
    setMode("update");
    setOpenForm(true);
  }, []);

  // === Columns ===
  const columns = useMemo<GridColDef<TypeTblAddress>[]>(
    () => [
      { field: "code", headerName: "Code", width: 60 },
      { field: "name", headerName: "Name", flex: 1 },
      { field: "address1", headerName: "Address 1", flex: 1 },
      { field: "address2", headerName: "Address 2", flex: 1 },
      { field: "phone", headerName: "Phone", flex: 2 },
      { field: "contact", headerName: "Contact Person", flex: 1 },
      { field: "eMail", headerName: "Email", flex: 1 },
      dataGridActionColumn({ onEdit: handleEdit, onDelete: handleDelete }),
    ],
    [handleEdit, handleDelete]
  );

  return (
    <>
      <CustomizedDataGrid
        label="Address"
        showToolbar
        onAddClick={handleCreate}
        onRefreshClick={handleRefresh}
        rows={rows}
        columns={columns}
        loading={loading}
        getRowId={(row) => row.addressId}
      />

      <AddressFormDialog
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
