import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import AddressFormDialog from "./AddressFormDialog";
import { useCallback, useMemo, useState } from "react";
import { Box } from "@mui/material";
import { tblAddress } from "@/core/api/generated/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type GridColDef, type GridRenderCellParams } from "@mui/x-data-grid";
import { dataGridActionColumn } from "@/shared/components/dataGrid/DataGridActionsColumn";
import { queryClient } from "@/core/api/queryClient";

export default function AddressListPage() {
  const [selected, setSelected] = useState<any | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"create" | "update">("create");

  // === Queries ===
  const { data, isLoading } = useQuery({
    queryKey: ["tblAddress"],
    queryFn: async () =>
      tblAddress.getAll({
        paginate: false,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => tblAddress.deleteById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tblAddress"] });
    },
  });

  // === Handlers ===
  const handleCreate = useCallback(() => {
    setSelected(null);
    setMode("create");
    setOpenForm(true);
  }, []);

  const handleEdit = useCallback((row: any) => {
    setSelected(row);
    setMode("update");
    setOpenForm(true);
  }, []);

  const handleDelete = useCallback((row: any) => {
    deleteMutation.mutate(row.addressId);
  }, []);

  const columns = useMemo<GridColDef[]>(
    () => [
      { field: "code", headerName: "Code", width: 60 },
      { field: "name", headerName: "Name", flex: 1 },
      { field: "addressId", headerName: "AddressId", flex: 1 }, // hideable columns
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
          recordId={selected?.addressId}
          onClose={() => setOpenForm(false)}
          onSuccess={(data) => {
            queryClient.setQueryData(["tblAddress"], (oldData) => {
              // if (!oldData) return { items: [data], total: 1 };
              // const items = [...oldData.items];
              // const index = items.findIndex(
              //   (i) => i.addressId === data.addressId
              // );
              // if (index > -1) items[index] = data;
              // else items.unshift(data);
              // return { ...oldData, items };
            });
            setOpenForm(false);
          }}
        />
      )}
    </Box>
  );
}
