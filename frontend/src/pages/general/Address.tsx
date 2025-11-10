import {useState} from "react";
import {Box, IconButton, Stack} from "@mui/material";
import {type GridColDef, type GridRenderCellParams} from "@mui/x-data-grid";
import CustomizedDataGrid from "@/shared/components/DataGrid";
import {tblAddress} from "@/core/api/generated/api";
import AddressFormDialog from "./AddressFormDialog";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function AddressListPage() {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<any | null>(null);
  const [openForm, setOpenForm] = useState(false);

  const [paginationModel, setPaginationModel] = useState({ page: 1, pageSize: 20 });

  const { data, isLoading } = useQuery({
    queryKey: ["tblAddress", paginationModel.page, paginationModel.pageSize],
    queryFn: async () => tblAddress.getAll({
      page: paginationModel.page,
      perPage: paginationModel.pageSize,
      force: true,
    }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => tblAddress.deleteById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tblAddress"] });
    },
  });

  const handleEdit = (row: any) => {
    setSelected(row);
    setOpenForm(true);
  };

  const handleDelete = (row: any) => {
    deleteMutation.mutate(row.addressId);
  };

  const columns: GridColDef[] = [
    { field: "code", headerName: "Code", flex: 1,  },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "address1", headerName: "Address 1", flex: 1 },
    { field: "address2", headerName: "Address 2", flex: 1 },
    { field: "phone", headerName: "Phone", flex: 1 },
    { field: "eMail", headerName: "Email", flex: 1 },
    { field: "country", headerName: "Country", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Stack direction="row" spacing={1} onClick={(e) => e.stopPropagation()}>
          <IconButton size="small" onClick={() => handleEdit(params.row)}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" color="error" onClick={() => handleDelete(params.row)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <Box height="100%">
      <CustomizedDataGrid
        rows={data?.items}
        columns={columns}
        loading={isLoading}
        // rowCount={data?.total}
        // paginationMode="server"
        // paginationModel={paginationModel}
        // onPaginationModelChange={setPaginationModel}
        getRowId={(row) => row.addressId}
      />

      {openForm && (
        <AddressFormDialog
          open={openForm}
          onClose={() => setOpenForm(false)}
          initialData={selected}
        />
      )}
    </Box>
  );
}
