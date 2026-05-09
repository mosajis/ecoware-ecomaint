import { useMemo, useCallback, useState } from "react";

import {
  DataGrid as MuiDataGrid,
  type DataGridProps,
  type GridColDef,
  type GridRowId,
  type GridRowParams,
  type GridValidRowModel,
  type GridSlotsComponent,
  type GridRowSelectionModel,
} from "@mui/x-data-grid";

import DataGridToolbar from "./DataGridToolbar";
import { getPermit } from "@/shared/hooks/usePermison";

const rowNumberColumn: GridColDef = {
  field: "rowNumber",
  headerName: "#",
  width: 50,
  sortable: false,
  filterable: false,
  disableColumnMenu: true,
  align: "center",
  headerAlign: "center",
  renderCell: (params) => params.api.getAllRowIds().indexOf(params.id) + 1,
};

interface CustomizedDataGridProps<
  R extends GridValidRowModel,
> extends DataGridProps<R> {
  label?: string;

  onAddClick?: () => void;
  onRefreshClick?: () => void;

  onEditClick?: (rowId: number) => void;
  onDeleteClick?: (rowId: number) => void;
  onDoubleClick?: (rowId: number) => void;

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

export default function GenericDataGrid<R extends GridValidRowModel>({
  rows = [],
  columns = [],
  initialState,

  label,
  loading,

  onAddClick,
  onRefreshClick,
  onEditClick,
  onDeleteClick,
  onDoubleClick,

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

  rowSelectionModel,
  checkboxSelection,

  ...rest
}: CustomizedDataGridProps<R>) {
  const permit = elementId
    ? getPermit(elementId)
    : {
        canCreate: true,
        canUpdate: true,
        canDelete: true,
        canView: true,
        canExport: true,
      };

  const { canCreate, canUpdate, canDelete, canView, canExport } = permit;

  if (!canView) {
    return null;
  }

  // =========================================
  // Internal Selection (Single Select Mode)
  // =========================================

  const [selectedRowId, setSelectedRowId] = useState<GridRowId | null>(null);

  // =========================================
  // Selection Helpers
  // =========================================

  const hasCheckboxSelection = checkboxSelection === true;

  const getSelectedIds = useCallback((): GridRowId[] => {
    if (hasCheckboxSelection && rowSelectionModel) {
      if (Array.isArray(rowSelectionModel)) {
        return rowSelectionModel;
      }

      return Array.from(
        (rowSelectionModel as Exclude<GridRowSelectionModel, GridRowId[]>).ids,
      );
    }

    return selectedRowId !== null ? [selectedRowId] : [];
  }, [hasCheckboxSelection, rowSelectionModel, selectedRowId]);

  const selectedIds = getSelectedIds();

  const hasSelection = selectedIds.length > 0;

  const selectedRow = selectedIds[0];

  // =========================================
  // Columns
  // =========================================

  const finalColumns = useMemo<GridColDef[]>(() => {
    const baseColumns = disableRowNumber
      ? [...columns]
      : [rowNumberColumn, ...columns];

    if (disableFilters) {
      return baseColumns.map((column) => ({
        ...column,
        filterable: false,
      }));
    }

    return baseColumns.map((column) => ({
      ...column,
      filterable: column.field !== "rowNumber" && column.filterable !== false,
    }));
  }, [columns, disableRowNumber, disableFilters]);

  // =========================================
  // Initial State
  // =========================================

  const mergedInitialState = useMemo(() => {
    return {
      density: "compact" as const,
      ...initialState,
    };
  }, [initialState]);

  // =========================================
  // Actions
  // =========================================

  const handleEdit = useCallback(() => {
    if (!selectedRow) {
      return;
    }

    onEditClick?.(Number(selectedRow));
  }, [selectedRow, onEditClick]);

  const handleDelete = useCallback(() => {
    if (!selectedRow) {
      return;
    }

    onDeleteClick?.(Number(selectedRow));
  }, [selectedRow, onDeleteClick]);

  // =========================================
  // Events
  // =========================================

  const handleRowClick = useCallback(
    (params: GridRowParams<R>) => {
      if (hasCheckboxSelection) {
        return;
      }

      setSelectedRowId(params.id);
    },
    [hasCheckboxSelection],
  );

  const handleRowDoubleClick = useCallback(
    (params: GridRowParams<R>) => {
      onDoubleClick?.(Number(params.id));
    },
    [onDoubleClick],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (!hasSelection) {
        return;
      }

      if (event.key === "Enter" && !disableEdit && canUpdate) {
        event.preventDefault();
        handleEdit();
      }

      if (event.key === "Delete" && !disableDelete && canDelete) {
        event.preventDefault();
        handleDelete();
      }
    },
    [
      hasSelection,

      disableEdit,
      disableDelete,

      canUpdate,
      canDelete,

      handleEdit,
      handleDelete,
    ],
  );

  // =========================================
  // Toolbar
  // =========================================

  const ToolbarSlot = useCallback(
    () => (
      <DataGridToolbar
        label={label ?? ""}
        loading={loading}
        hasSelection={hasSelection}
        onAddClick={onAddClick}
        onRefreshClick={onRefreshClick}
        onEditClick={handleEdit}
        onDeleteClick={handleDelete}
        disableSearch={disableSearch}
        disableDensity={disableDensity}
        disableExport={!canExport || disableExport}
        disableColumns={disableColumns}
        disableFilters={disableFilters}
        disableAdd={!canCreate || disableAdd}
        disableRefresh={disableRefresh}
        disableEdit={!canUpdate || disableEdit}
        disableDelete={!canDelete || disableDelete}
      >
        {toolbarChildren}
      </DataGridToolbar>
    ),
    [
      label,
      loading,

      hasSelection,

      onAddClick,
      onRefreshClick,

      handleEdit,
      handleDelete,

      disableSearch,
      disableDensity,
      disableExport,
      disableColumns,
      disableFilters,

      disableAdd,
      disableRefresh,
      disableEdit,
      disableDelete,

      toolbarChildren,

      canCreate,
      canUpdate,
      canDelete,
      canExport,
    ],
  );

  const slots: Partial<GridSlotsComponent> = useMemo(
    () => ({
      toolbar: ToolbarSlot,
    }),
    [ToolbarSlot],
  );

  return (
    <>
      <MuiDataGrid
        rows={rows}
        columns={finalColumns}
        loading={loading}
        slots={slots}
        initialState={mergedInitialState}
        onRowClick={handleRowClick}
        onRowDoubleClick={handleRowDoubleClick}
        getRowClassName={(params) =>
          params.id === selectedRowId ? "Mui-selected" : ""
        }
        pageSizeOptions={[10, 25, 50, 100]}
        checkboxSelection={checkboxSelection}
        rowSelectionModel={rowSelectionModel}
        slotProps={{
          root: {
            onKeyDown: handleKeyDown,
          },
        }}
        {...rest}
      />

      {children}
    </>
  );
}
