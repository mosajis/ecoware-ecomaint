import DataGridToolbar from "./DataGridToolbar";
import {
  DataGrid,
  type DataGridProps,
  type GridColDef,
} from "@mui/x-data-grid";

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
    const rowIndex = api.getRowIndexRelativeToVisibleRows(params.id) + 1;
    return page * pageSize + rowIndex;
  },
};

interface CustomizedDataGridProps extends DataGridProps {
  leftToolbar?: React.ReactNode;
  label?: string;
  onAddClick?: () => void;
  onRefreshClick?: () => void;
}

export default function CustomizedDataGrid({
  rows,
  columns = [],
  leftToolbar,
  initialState,
  label,
  onAddClick,
  onRefreshClick,
  ...rest
}: CustomizedDataGridProps) {
  const columnsWithRowNumber: GridColDef[] = [rowNumberColumn, ...columns];

  return (
    <DataGrid
      rows={rows}
      columns={columnsWithRowNumber}
      initialState={{
        density: "compact",
        ...initialState,
      }}
      // @ts-ignore
      slots={{ toolbar: DataGridToolbar }}
      slotProps={{
        toolbar: {
          // @ts-ignore
          onAddClick,
          onRefreshClick,
          label,
        },
      }}
      {...rest}
    />
  );
}
