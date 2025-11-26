import DialogHeader from "./dialog/DialogHeader";
import CustomizedDataGrid from "./dataGrid/DataGrid";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogActions, Button } from "@mui/material";
import {
  GridRowId,
  GridRowIdGetter,
  GridRowSelectionModel,
} from "@mui/x-data-grid";

export interface SelectModalProps<TItem extends Record<string, any>> {
  open: boolean;
  onClose: () => void;
  title?: string;

  request: () => Promise<any>; // API real type
  extractRows?: (data: any) => TItem[]; // extractor

  columns: any[];
  selectionMode?: "single" | "multiple";
  onSelect: (selected: TItem[] | TItem | null) => void;

  getRowId: GridRowIdGetter<TItem>;

  // اضافه‌شده برای ارتفاع و maxWidth
  height?: number | string;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false;
}

export function AsyncSelectDialog<TItem extends Record<string, any>>({
  open,
  onClose,
  title = "Select",
  request,
  extractRows,
  columns,
  onSelect,
  selectionMode = "single",
  getRowId,
  height = 600,
  maxWidth = "md",
}: SelectModalProps<TItem>) {
  const [rows, setRows] = useState<TItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selection, setSelection] = useState<GridRowSelectionModel>({
    type: "include",
    ids: new Set<GridRowId>(),
  });

  useEffect(() => {
    if (!open) return;

    const controller = new AbortController();

    setSelection({ type: "include", ids: new Set<GridRowId>() });

    setLoading(true);

    request()
      .then((data) => {
        if (controller.signal.aborted) return;
        const items = extractRows ? extractRows(data) : data;
        setRows(Array.isArray(items) ? items : []);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [open]);

  const handleOk = () => {
    if (selectionMode === "single") {
      const selectedId = Array.from(selection.ids)[0];
      const selected = rows.find((r) => getRowId(r) === selectedId) ?? null;
      onSelect(selected);
    } else {
      const selectedRows = rows.filter((r) => selection.ids.has(getRowId(r)));
      onSelect(selectedRows);
    }

    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth={maxWidth}>
      <DialogContent sx={{ height, p: 1 }}>
        <CustomizedDataGrid
          getRowId={getRowId}
          label={title}
          rows={rows}
          columns={columns}
          loading={loading}
          showToolbar
          disableAdd
          disableColumnFilter
          disableDensity
          disableExport
          disableColumns
          checkboxSelection={selectionMode === "multiple"}
          disableRowSelectionOnClick={false}
          onRowSelectionModelChange={setSelection}
        />
      </DialogContent>
      <DialogActions sx={{ p: 0, m: 1 }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
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
          Cancell
        </Button>
      </DialogActions>
    </Dialog>
  );
}
