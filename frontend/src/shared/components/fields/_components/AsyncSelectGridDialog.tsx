import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import CustomizedDataGrid from "../../dataGrid/DataGrid";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { useEffect, useState, useCallback } from "react";
import {
  GridRowId,
  GridRowIdGetter,
  GridRowSelectionModel,
} from "@mui/x-data-grid";

export interface SelectModalProps<TItem extends Record<string, any>> {
  open: boolean;
  title?: string;
  elementId: number;
  onClose: () => void;
  request: () => Promise<any>;
  extractRows?: (data: any) => TItem[];
  onSelect: (selected: TItem | TItem[] | null) => void;
  getRowId: GridRowIdGetter<TItem>;
  disableRowNumber?: boolean;
  columns: any[];
  selectionMode?: "single" | "multiple";
  selected?: TItem | TItem[] | null;
  height?: number | string;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false;
}

export function AsyncSelectGridDialog<TItem extends Record<string, any>>({
  elementId,
  open,
  title = "Select",
  selectionMode = "single",
  columns,
  disableRowNumber = false,
  onClose,
  request,
  extractRows,
  onSelect,
  getRowId,
  selected = null,
  height = 600,
  maxWidth = "sm",
}: SelectModalProps<TItem>) {
  const [rows, setRows] = useState<TItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>({
      type: "include",
      ids: new Set(),
    });

  // ---------------- Fetch Data ----------------
  const fetchData = useCallback(async () => {
    setLoading(true);

    try {
      const data = await request();
      const items: TItem[] = extractRows
        ? extractRows(data)
        : (data.items ?? []);
      setRows(Array.isArray(items) ? items : []);
    } finally {
      setLoading(false);
    }
  }, [request, extractRows]);

  // ---------------- Initialize Selection ----------------
  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open, fetchData]);

  useEffect(() => {
    const _s =
      selectionMode === "multiple"
        ? (Array.isArray(selected) ? selected : []).map((item) =>
            getRowId(item),
          )
        : selected
          ? [getRowId(selected as TItem)]
          : [];

    const newSelection = {
      type: "include" as const,
      ids: new Set<GridRowId>(_s),
    };

    setRowSelectionModel(newSelection);
  }, [selected, selectionMode, getRowId]);

  const rowMap = new Map<GridRowId, TItem>(rows.map((r) => [getRowId(r), r]));

  const resolveSelection = (model: GridRowSelectionModel, rows: TItem[]) => {
    const ids = new Set(model.ids);

    const rowMap = new Map(rows.map((r) => [getRowId(r), r]));

    if (model.type === "include") {
      return Array.from(ids)
        .map((id) => rowMap.get(id))
        .filter(Boolean);
    }

    // exclude mode (Select All)
    return rows.filter((r) => !ids.has(getRowId(r)));
  };

  // ---------------- Handle OK ----------------
  const handleOk = () => {
    if (selectionMode === "single") {
      const selectedIds = Array.from(rowSelectionModel.ids);
      const id = selectedIds[0];
      const item = rowMap.get(id) ?? null;

      onSelect(item);
      onClose();
      return;
    }

    const items = resolveSelection(rowSelectionModel, rows) as TItem[];

    onSelect(items);
    onClose();
  };

  // ---------------- Handle Double Click ----------------
  const handleRowDoubleClick = ({ row }: { row: TItem }) => {
    const rowId = getRowId(row);
    const newSelection = {
      type: "include" as const,
      ids: new Set<GridRowId>([rowId]),
    };
    setRowSelectionModel(newSelection);

    if (selectionMode === "single") {
      onSelect(row);
      onClose();
    }
  };

  // ---------------- Render ----------------
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth={maxWidth}>
      <DialogContent sx={{ height, p: 1 }}>
        <CustomizedDataGrid
          elementId={elementId}
          showToolbar
          disableAdd
          disableDelete
          disableEdit
          disableColumnFilter
          disableExport
          disableColumns
          disableRowNumber={disableRowNumber}
          rows={rows}
          loading={loading}
          label={title}
          columns={columns}
          checkboxSelection={selectionMode === "multiple"}
          onRowSelectionModelChange={setRowSelectionModel}
          rowSelectionModel={rowSelectionModel}
          onRowDoubleClick={handleRowDoubleClick}
          onRefreshClick={fetchData}
          getRowId={getRowId}
        />
      </DialogContent>
      <DialogActions sx={{ p: 0, m: 1 }}>
        <Button
          type="submit"
          variant="contained"
          color="secondary"
          sx={{ flex: 1 }}
          onClick={handleOk}
        >
          Ok
        </Button>
        <Button
          color="inherit"
          variant="outlined"
          sx={{ flex: 1 }}
          onClick={onClose}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
