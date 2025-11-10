import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Box, IconButton, Stack } from "@mui/material";
import CustomizedDataGrid from "@/shared/components/DataGrid";
import { tblAddress } from "@/core/api/generated/api";
import AddressFormDialog from "./AddressFormDialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
export default function AddressListPage() {
    const queryClient = useQueryClient();
    const [selected, setSelected] = useState(null);
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
        mutationFn: (id) => tblAddress.deleteById(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tblAddress"] });
        },
    });
    const handleEdit = (row) => {
        setSelected(row);
        setOpenForm(true);
    };
    const handleDelete = (row) => {
        deleteMutation.mutate(row.addressId);
    };
    const columns = [
        { field: "code", headerName: "Code", flex: 1, },
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
            renderCell: (params) => (_jsxs(Stack, { direction: "row", spacing: 1, onClick: (e) => e.stopPropagation(), children: [_jsx(IconButton, { size: "small", onClick: () => handleEdit(params.row), children: _jsx(EditIcon, { fontSize: "small" }) }), _jsx(IconButton, { size: "small", color: "error", onClick: () => handleDelete(params.row), children: _jsx(DeleteIcon, { fontSize: "small" }) })] })),
        },
    ];
    return (_jsxs(Box, { height: "100%", children: [_jsx(CustomizedDataGrid, { rows: data?.items, columns: columns, loading: isLoading, 
                // rowCount={data?.total}
                // paginationMode="server"
                // paginationModel={paginationModel}
                // onPaginationModelChange={setPaginationModel}
                getRowId: (row) => row.addressId }), openForm && (_jsx(AddressFormDialog, { open: openForm, onClose: () => setOpenForm(false), initialData: selected }))] }));
}
