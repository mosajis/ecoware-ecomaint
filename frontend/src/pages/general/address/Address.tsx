import DataGrid from "@/shared/components/dataGrid/DataGrid";
import Upsert from "./AddressUpsert";

import { tblAddress } from "@/core/api/generated/api";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { columns, getRowId } from "./AddressColumns";
import { useUpsertDialog } from "@/shared/hooks/useUpsertDialog";

export default function PageAddress() {
  const { rows, loading, handleDelete, handleRefresh } = useDataGrid(
    tblAddress.getAll,
    tblAddress.deleteById,
    "addressId",
  );

  const { openCreate, openEdit, openView, dialogProps } = useUpsertDialog({
    onSuccess: handleRefresh,
  });

  const label = "Address";

  return (
    <DataGrid
      showToolbar
      disableRowNumber
      elementId={100}
      label={label}
      rows={rows}
      columns={columns}
      loading={loading}
      onRefreshClick={handleRefresh}
      onDeleteClick={handleDelete}
      onAddClick={openCreate}
      onEditClick={openEdit}
      onDoubleClick={openView}
      getRowId={getRowId}
    >
      <Upsert entityName={label} {...dialogProps} />
    </DataGrid>
  );
}
