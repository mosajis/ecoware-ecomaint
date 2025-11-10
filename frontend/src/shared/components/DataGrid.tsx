import {DataGrid, type DataGridProps, type GridColDef} from "@mui/x-data-grid";

const rowNumberColumn: GridColDef = {
  field: "rowNumber",
  headerName: "#",
  width: 60,
  sortable: false,
  filterable: false,
  disableColumnMenu: true,
  align: "center",
  headerAlign: "center",
  renderCell: (params) => {
    const api = params.api;
    const page = api.state.pagination.paginationModel.page ?? 0;
    const pageSize = api.state.pagination.paginationModel.pageSize ?? 20;
    const rowIndex = params.api.getRowIndexRelativeToVisibleRows(params.id) + 1
    return page * pageSize + (rowIndex + 1);
  },
};

export default function CustomizedDataGrid({
                                             rows, columns,
                                             ...props
                                           }: DataGridProps) {

  const columnsWithRowNumber = [rowNumberColumn, ...(columns || [])];

  return (
    <DataGrid
      rows={rows}
      columns={columnsWithRowNumber}
      showToolbar
      density="compact"
      slotProps={{
        filterPanel: {
          filterFormProps: {
            logicOperatorInputProps: {
              variant: "outlined",
              size: "small",
            },
            columnInputProps: {
              variant: "outlined",
              size: "small",
              sx: {mt: "auto"},
            },
            operatorInputProps: {
              variant: "outlined",
              size: "small",
              sx: {mt: "auto"},
            },
            valueInputProps: {
              InputComponentProps: {
                variant: "outlined",
                size: "small",
              },
            },
          },
        },
      }}
      {...props}
    />
  );
}
