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

import { useMemo, useCallback, useState, useRef, ReactNode } from "react";

const rowNumberColumn = (
  rowNumberCell?: (rowId: number, index: number) => ReactNode,
): GridColDef => ({
  field: "rowNumber",
  headerName: "#",
  width: 35,
  sortable: false,
  filterable: false,
  disableColumnMenu: true,
  align: "center",
  headerAlign: "center",
  renderCell: (params) => {
    const index = params.api.getAllRowIds().indexOf(params.id) + 1;
    return rowNumberCell ? rowNumberCell(params.row, index) : index;
  },
});

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
  externalRowSelection?: boolean;
  rowNumberCell?: (row: any, index: number) => ReactNode;
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
  externalRowSelection = false,
  rowNumberCell,
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

  const clickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [internalRowSelectionModel, setInternalRowSelectionModel] =
    useState<GridRowSelectionModel>({
      type: "include",
      ids: new Set<GridRowId>([]),
    });

  const rowSelectionModel: GridRowSelectionModel = externalRowSelection
    ? (rest.rowSelectionModel ?? {
        type: "include",
        ids: new Set<GridRowId>([]),
      })
    : internalRowSelectionModel;

  const handleRowSelectionChangeInternal = useCallback(
    (model: GridRowSelectionModel, _details: GridCallbackDetails) => {
      if (!externalRowSelection) {
        setInternalRowSelectionModel(model);
      }
    },
    [externalRowSelection],
  );

  const handleRowSelectionChange = externalRowSelection
    ? rest.onRowSelectionModelChange
    : handleRowSelectionChangeInternal;

  const columnsWithRowNumber = useMemo(() => {
    return disableRowNumber
      ? columns
      : [rowNumberColumn(rowNumberCell), ...columns];
  }, [columns, disableRowNumber, rowNumberCell]);

  const mergedInitialState = useMemo(() => {
    return {
      density: "compact" as const,
      ...initialState,
    };
  }, [initialState]);

  const handleEdit = useCallback(() => {
    if (rowSelectionModel.ids.size !== 1) return;

    const rowId = Array.from(rowSelectionModel.ids)[0];
    if (!rowId) return;
    onEditClick?.(Number(rowId));
  }, [rowSelectionModel, onEditClick]);

  const handleDelete = useCallback(() => {
    if (rowSelectionModel.ids.size !== 1) return;

    const rowId = Array.from(rowSelectionModel.ids)[0];
    if (!rowId) return;
    onDeleteClick?.(Number(rowId));
  }, [rowSelectionModel, onDeleteClick]);

  const handleRowClick = useCallback(
    (params: any) => {
      if (externalRowSelection) return;

      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }

      clickTimeoutRef.current = setTimeout(() => {
        setInternalRowSelectionModel({
          type: "include",
          ids: new Set([params.id]),
        });
      }, 150);
    },
    [externalRowSelection],
  );

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
        hasSelection={rowSelectionModel.ids.size === 1}
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
      canUpdate,
      canDelete,
    ],
  );

  const slots: Partial<GridSlotsComponent> = useMemo(
    () => ({ toolbar: ToolbarWrapper }),
    [ToolbarWrapper],
  );

  return (
    <>
      <MuiDataGrid
        rows={rows}
        columns={columnsWithRowNumber}
        initialState={mergedInitialState}
        slots={slots}
        rowSelectionModel={rowSelectionModel}
        onRowSelectionModelChange={handleRowSelectionChange}
        getRowId={getRowId}
        onRowClick={handleRowClick}
        onRowDoubleClick={handleRowDoubleClick}
        rowHeight={42}
        {...rest}
      />

      {children}
    </>
  );
}
