import DataGridToolbar from "./DataGridToolbar";
import {
  DataGrid,
  type DataGridProps,
  type GridColDef,
  type GridSlotsComponent,
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
  label?: string;
  onAddClick?: () => void;
  onRefreshClick?: () => void;

  disableSearch?: boolean;
  disableDensity?: boolean;
  disableExport?: boolean;
  disableColumns?: boolean;
  disableFilters?: boolean;
  disableAdd?: boolean;
  disableRefresh?: boolean;

  disableRowNumber?: boolean;
}

export default function CustomizedDataGrid({
  rows,
  columns = [],
  initialState,
  label,
  loading,
  onAddClick,
  onRefreshClick,
  disableSearch,
  disableDensity,
  disableExport,
  disableColumns,
  disableFilters,
  disableAdd,
  disableRefresh,
  disableRowNumber,
  ...rest
}: CustomizedDataGridProps) {
  const indexedRows = useMemo(() => {
    if (!rows) return [];
    if (disableRowNumber) return rows;
    return rows.map((row, index) => ({ ...row, rowNumber: index + 1 }));
  }, [rows, disableRowNumber]);

  const columnsWithRowNumber = useMemo(() => {
    return disableRowNumber ? columns : [rowNumberColumn, ...columns];
  }, [columns, disableRowNumber]);

  const mergedInitialState = useMemo(() => {
    return {
      density: "compact" as const,
      ...initialState,
    };
  }, [initialState]);

  const ToolbarWrapper = useMemo(
    () => (props: any) => (
      <DataGridToolbar
        {...props}
        label={label!}
        loading={loading}
        onAddClick={onAddClick}
        onRefreshClick={onRefreshClick}
        disableSearch={disableSearch}
        disableDensity={disableDensity}
        disableExport={disableExport}
        disableColumns={disableColumns}
        disableFilters={disableFilters}
        disableAdd={disableAdd}
        disableRefresh={disableRefresh}
      />
    ),
    [
      label,
      loading,
      onAddClick,
      onRefreshClick,
      disableSearch,
      disableDensity,
      disableExport,
      disableColumns,
      disableFilters,
      disableAdd,
      disableRefresh,
    ]
  );

  const slots: Partial<GridSlotsComponent> = useMemo(
    () => ({ toolbar: ToolbarWrapper }),
    [ToolbarWrapper]
  );

  return (
    <DataGrid
      rows={indexedRows}
      columns={columnsWithRowNumber}
      initialState={mergedInitialState}
      slots={slots}
      {...rest}
    />
  );
}
