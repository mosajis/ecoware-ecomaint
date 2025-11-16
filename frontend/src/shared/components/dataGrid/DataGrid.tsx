import DataGridToolbar from "./DataGridToolbar";
import {
  DataGrid,
  type DataGridProps,
  type GridColDef,
} from "@mui/x-data-grid";
import { useMemo } from "react";

const rowNumberColumn: GridColDef = {
  field: "rowNumber",
  headerName: "#",
  width: 60,
  sortable: false,
  filterable: false,
  disableColumnMenu: true,
  align: "center",
  headerAlign: "center",
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
  loading,
  onAddClick,
  onRefreshClick,
  ...rest
}: CustomizedDataGridProps) {
  const indexedRows = useMemo(() => {
    if (!rows) return;
    return rows.map((row, index) => ({
      ...row,
      rowNumber: index + 1,
    }));
  }, [rows]);

  const columnsWithRowNumber = useMemo(
    () => [rowNumberColumn, ...columns],
    [columns]
  );

  return (
    <DataGrid
      rows={indexedRows}
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
          loading,
        },
      }}
      {...rest}
    />
  );
}
