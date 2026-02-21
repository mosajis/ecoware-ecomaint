import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import AddressUpsert from "./AddressUpsert";

import { useCallback, useState } from "react";
import { tblAddress, TypeTblAddress } from "@/core/api/generated/api";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { columns } from "./AddressColumns";
import { useDialogs } from "@/shared/hooks/useDialogs";

const getRowId = (row: TypeTblAddress) => row.addressId;

export default function PageAddress() {
  const [selectedRowId, setSelectedRowId] = useState<null | number>(null);
  const { dialogs, openDialog, closeDialog } = useDialogs({
    upsert: false,
  });

  const [mode, setMode] = useState<"create" | "update">("create");

  const { rows, loading, handleDelete, handleRefresh } = useDataGrid(
    tblAddress.getAll,
    tblAddress.deleteById,
    "addressId",
  );

  const handleCreate = useCallback(() => {
    setSelectedRowId(null);
    setMode("create");
    openDialog("upsert");
  }, []);

  const handleEdit = useCallback((rowId: number) => {
    setSelectedRowId(rowId);
    setMode("update");
    openDialog("upsert");
  }, []);

  return (
    <>
      <CustomizedDataGrid
        showToolbar
        disableRowNumber
        label="Address"
        rows={rows}
        columns={columns}
        loading={loading}
        onAddClick={handleCreate}
        onRefreshClick={handleRefresh}
        onDeleteClick={handleDelete}
        onEditClick={handleEdit}
        onDoubleClick={handleEdit}
        getRowId={getRowId}
      />

      <AddressUpsert
        open={dialogs.upsert}
        mode={mode}
        recordId={selectedRowId}
        onClose={() => closeDialog("upsert")}
        onSuccess={handleRefresh}
      />
    </>
  );
}
