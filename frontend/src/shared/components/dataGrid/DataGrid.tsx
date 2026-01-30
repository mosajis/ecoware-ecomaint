import DataGridToolbar from "./DataGridToolbar";
import { DataGrid as MuiDataGrid, GridRowId } from "@mui/x-data-grid";
import {
  type DataGridProps,
  type GridColDef,
  type GridSlotsComponent,
  type GridRowSelectionModel,
  type GridCallbackDetails,
} from "@mui/x-data-grid";

import { useMemo, useCallback, useState } from "react";

const rowNumberColumn: GridColDef = {
  field: "rowNumber",
  headerName: "#",
  width: 35,
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
  onEditClick?: (rowId: number) => void;
  onDoubleClick?: (rowId: number) => void;
  onDeleteClick?: (rowId: number) => void;
  getRowId: (row: any) => GridRowId;
  disableSearch?: boolean;
  disableDensity?: boolean;
  disableExport?: boolean;
  disableColumns?: boolean;
  disableFilters?: boolean;
  disableAdd?: boolean;
  disableRefresh?: boolean;
  disableEdit?: boolean;
  disableDelete?: boolean;
  disableRowNumber?: boolean;

  toolbarChildren?: React.ReactNode;
}

export default function GenericDataGrid({
  rows,
  columns = [],
  initialState,
  label,
  loading,
  onAddClick,
  onRefreshClick,
  onEditClick,
  onDeleteClick,
  onDoubleClick,
  getRowId,
  disableSearch,
  disableDensity = true,
  disableExport,
  disableColumns,
  disableFilters,
  disableAdd,
  disableRefresh,
  disableEdit,
  disableDelete,
  disableRowNumber,
  toolbarChildren,
  ...rest
}: CustomizedDataGridProps) {
  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>({
      type: "include",
      ids: new Set<GridRowId>([]),
    });

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

  const handleRowSelectionChange = useCallback(
    (
      rowSelectionModel: GridRowSelectionModel,
      details: GridCallbackDetails,
    ) => {
      setRowSelectionModel(rowSelectionModel);
    },
    [],
  );

  const handleEdit = useCallback(() => {
    const rowId = Array.from(rowSelectionModel.ids)[0];
    if (!rowId) return;
    onEditClick?.(Number(rowId));
  }, [rowSelectionModel, onEditClick]);

  const handleDelete = useCallback(() => {
    const rowId = Array.from(rowSelectionModel.ids)[0];
    if (!rowId) return;
    onDeleteClick?.(Number(rowId));
  }, [rowSelectionModel, onDeleteClick]);

  const ToolbarWrapper = useMemo(
    () => (props: any) => (
      <DataGridToolbar
        {...props}
        label={label!}
        loading={loading}
        onAddClick={onAddClick}
        onRefreshClick={onRefreshClick}
        onEditClick={handleEdit}
        onDeleteClick={handleDelete}
        hasSelection={rowSelectionModel.ids.size > 0}
        disableSearch={disableSearch}
        disableDensity={disableDensity}
        disableExport={disableExport}
        disableColumns={disableColumns}
        disableFilters={disableFilters}
        disableAdd={disableAdd}
        disableRefresh={disableRefresh}
        disableEdit={disableEdit}
        disableDelete={disableDelete}
      >
        {toolbarChildren}
      </DataGridToolbar>
    ),
    [
      toolbarChildren,
      label,
      loading,
      onAddClick,
      onRefreshClick,
      handleEdit,
      handleDelete,
      rowSelectionModel,
      disableSearch,
      disableDensity,
      disableExport,
      disableColumns,
      disableFilters,
      disableAdd,
      disableRefresh,
      disableEdit,
      disableDelete,
    ],
  );

  const slots: Partial<GridSlotsComponent> = useMemo(
    () => ({ toolbar: ToolbarWrapper }),
    [ToolbarWrapper],
  );

  return (
    <MuiDataGrid
      rows={indexedRows}
      columns={columnsWithRowNumber}
      initialState={mergedInitialState}
      slots={slots}
      rowSelectionModel={rowSelectionModel}
      onRowSelectionModelChange={handleRowSelectionChange}
      getRowId={getRowId}
      onRowDoubleClick={(params, event) => onDoubleClick?.(Number(params.id))}
      {...rest}
    />
  );
}
