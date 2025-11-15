import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import AddressFormDialog from "./AddressFormDialog";
import { useCallback, useMemo, useState } from "react";
import { Box } from "@mui/material";
import { tblAddress, TypeTblAddress } from "@/core/api/generated/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { type GridColDef } from "@mui/x-data-grid";
import { dataGridActionColumn } from "@/shared/components/dataGrid/DataGridActionsColumn";
import { queryClient } from "@/core/api/queryClient";

export default function AddressListPage() {
  const [selectedRowId, setSelectedRowId] = useState<null | number>(null);
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"create" | "update">("create");

  // === Queries ===
  const { data, isLoading } = useQuery<{
    items: TypeTblAddress[];
    total: number;
  }>({
    queryKey: ["tblAddress"],
    queryFn: async () => tblAddress.getAll({ paginate: false }),
  });

  // === Mutations ===
  const deleteMutation = useMutation({
    mutationFn: (id: number) => tblAddress.deleteById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tblAddress"] });
    },
  });

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

  const handleDelete = useCallback((row: TypeTblAddress) => {
    deleteMutation.mutate(row.addressId);
  }, []);

  // === Columns ===
  const columns = useMemo<GridColDef[]>(
    () => [
      { field: "code", headerName: "Code" },
      { field: "name", headerName: "Name", flex: 1 },
      { field: "address1", headerName: "Address 1", flex: 1 },
      { field: "address2", headerName: "Address 2", flex: 1 },
      { field: "phone", headerName: "Phone", flex: 1 },
      { field: "contact", headerName: "Contact Person", flex: 1 },
      { field: "eMail", headerName: "Email", flex: 1 },
      dataGridActionColumn({ onEdit: handleEdit, onDelete: handleDelete }),
    ],
    [handleEdit, handleDelete]
  );

  return (
    <Box height="100%">
      <CustomizedDataGrid
        label="Address"
        showToolbar
        onAddClick={handleCreate}
        rows={data?.items ?? []}
        columns={columns}
        loading={isLoading}
        getRowId={(row) => row.addressId}
      />

      {openForm && (
        <AddressFormDialog
          open={openForm}
          mode={mode}
          recordId={selectedRowId}
          onClose={() => setOpenForm(false)}
          onSuccess={(newData: TypeTblAddress) => {
            setOpenForm(false);
          }}
        />
      )}
    </Box>
  );
}
