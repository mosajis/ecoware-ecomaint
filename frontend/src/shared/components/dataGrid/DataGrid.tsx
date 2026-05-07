import DataGridToolbar from "./DataGridToolbar";
import { getPermit } from "@/shared/hooks/usePermison";
import { DataGrid as MuiDataGrid, GridRowId } from "@mui/x-data-grid";
import {
  type DataGridProps,
  type GridColDef,
  type GridSlotsComponent,
  type GridRowSelectionModel,
  type GridCallbackDetails,
} from "@mui/x-data-grid";

import { useMemo, useCallback, useState, useRef } from "react";

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
  elementId?: number;
  children?: React.ReactNode;
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
  elementId,
  children,
  ...rest
}: CustomizedDataGridProps) {
  let { canCreate, canUpdate, canDelete, canView, canExport } = getPermit(
    elementId!,
  );

  if (!elementId) {
    canCreate = true;
    canUpdate = true;
    canView = true;
    canExport = true;
  }

  if (!canView) return null;

  // ✅ FIX: stable ref instead of variable
  const clickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    (model: GridRowSelectionModel, _details: GridCallbackDetails) => {
      setRowSelectionModel(model);
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

  const handleRowClick = useCallback((params: any) => {
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }

    clickTimeoutRef.current = setTimeout(() => {
      setRowSelectionModel({
        type: "include",
        ids: new Set([params.id]),
      });
    }, 150);
  }, []);

  const handleRowDoubleClick = useCallback(
    (params: any) => {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }

      onDoubleClick?.(Number(params.id));
    },
    [onDoubleClick],
  );

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
        disableColumns={disableColumns}
        disableFilters={disableFilters}
        disableExport={!canExport || disableExport}
        disableAdd={!canCreate || disableAdd}
        disableEdit={!canUpdate || disableEdit}
        disableDelete={!canDelete || disableDelete}
        disableRefresh={disableRefresh}
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
    <>
      <MuiDataGrid
        rows={indexedRows}
        columns={columnsWithRowNumber}
        initialState={mergedInitialState}
        slots={slots}
        rowSelectionModel={rowSelectionModel}
        onRowSelectionModelChange={handleRowSelectionChange}
        getRowId={getRowId}
        onRowClick={handleRowClick}
        onRowDoubleClick={handleRowDoubleClick}
        {...rest}
      />

      {children}
    </>
  );
}
