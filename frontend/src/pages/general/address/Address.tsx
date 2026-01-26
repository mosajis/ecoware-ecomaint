import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import AddressUpsert from "./AddressUpsert";
import { type GridColDef } from "@mui/x-data-grid";
import { useCallback, useState } from "react";
import { tblAddress, TypeTblAddress } from "@/core/api/generated/api";
import { useDataGrid } from "@/shared/hooks/useDataGrid";

const getRowId = (row: TypeTblAddress) => row.addressId;

const columns: GridColDef<TypeTblAddress>[] = [
  { field: "code", headerName: "Code", width: 60 },
  { field: "name", headerName: "Name", flex: 1 },
  { field: "address1", headerName: "Address 1", flex: 1 },
  { field: "address2", headerName: "Address 2", flex: 1 },
  { field: "phone", headerName: "Phone", flex: 2 },
  { field: "contact", headerName: "Contact Person", flex: 1 },
  { field: "eMail", headerName: "Email", flex: 1 },
  { field: "orderNo", headerName: "Order No", width: 100 },
];

export default function PageAddress() {
  const [selectedRowId, setSelectedRowId] = useState<null | number>(null);
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"create" | "update">("create");

  // === useDataGrid ===
  const { rows, loading, handleDelete, handleRefresh } = useDataGrid(
    tblAddress.getAll,
    tblAddress.deleteById,
    "addressId",
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
        label="Address"
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

      <AddressUpsert
        open={openForm}
        mode={mode}
        recordId={selectedRowId}
        onClose={handleUpsertClose}
        onSuccess={handleRefresh}
      />
    </>
  );
}
