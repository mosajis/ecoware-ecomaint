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
import { useDebounce } from "@/shared/hooks/useDebounce";
import { TextField } from "@mui/material";
import { Search } from "@mui/icons-material";

// ---------------- Online Search Config ----------------
type OnlineSearchConfig = {
  paramKey?: string; // default: "search"
};

export interface SelectModalProps<TItem extends Record<string, any>> {
  open: boolean;
  title?: string;
  elementId: number;
  onClose: () => void;
  request: (params?: Record<string, string>) => Promise<any>; // ← آپدیت
  extractRows?: (data: any) => TItem[];
  onSelect: (selected: TItem | TItem[] | null) => void;
  getRowId: GridRowIdGetter<TItem>;
  disableRowNumber?: boolean;
  columns: any[];
  selectionMode?: "single" | "multiple";
  selected?: TItem | TItem[] | null;
  height?: number | string;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false;
  onlineSearch?: OnlineSearchConfig; // ← اضافه شد
}

export function AsyncSelectGridDialog<TItem extends Record<string, any>>({
  onlineSearch,
  elementId,
  open,
  title = "Select",
  selectionMode = "single",
  columns,
  disableRowNumber = false,
  request, // ← کاما اضافه شد
  onClose,
  extractRows,
  onSelect,
  getRowId,
  selected = null,
  height = 600,
  maxWidth = "sm",
}: SelectModalProps<TItem>) {
  // ---------------- State (باید قبل از useCallback باشه) ----------------
  const [rows, setRows] = useState<TItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>({
      type: "include",
      ids: new Set(),
    });

  const debouncedSearch = useDebounce(searchTerm, 400);

  // ---------------- Fetch Data ----------------
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = onlineSearch
        ? { [onlineSearch.paramKey ?? "search"]: debouncedSearch }
        : undefined;

      const data = await request(params);
      const items: TItem[] = extractRows
        ? extractRows(data)
        : (data.items ?? []);
      setRows(Array.isArray(items) ? items : []);
    } finally {
      setLoading(false);
    }
  }, [request, extractRows, debouncedSearch, onlineSearch]);

  // ---------------- یه useEffect برای هر دو حالت ----------------
  useEffect(() => {
    if (open) fetchData();
  }, [open, fetchData]);

  // ---------------- Initialize Selection ----------------
  useEffect(() => {
    const _s =
      selectionMode === "multiple"
        ? (Array.isArray(selected) ? selected : []).map((item) =>
            getRowId(item),
          )
        : selected
          ? [getRowId(selected as TItem)]
          : [];

    setRowSelectionModel({
      type: "include" as const,
      ids: new Set<GridRowId>(_s),
    });
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
    setRowSelectionModel({
      type: "include" as const,
      ids: new Set<GridRowId>([rowId]),
    });

    if (selectionMode === "single") {
      onSelect(row);
      onClose();
    }
  };

  // ---------------- Render ----------------
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth={maxWidth}>
      <DialogContent
        sx={{
          height,
          p: 1,
          display: "grid",
          gridTemplateRows: onlineSearch?.paramKey ? "auto 1fr" : "1fr",
        }}
      >
        {onlineSearch?.paramKey && (
          <TextField
            autoFocus
            size="small"
            fullWidth
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 1 }}
            InputProps={{
              startAdornment: (
                <Search
                  fontSize="small"
                  sx={{ mr: 1, color: "text.secondary" }}
                />
              ),
            }}
          />
        )}

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
