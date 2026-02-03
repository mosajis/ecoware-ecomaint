import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ClearIcon from "@mui/icons-material/Clear";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import { JSX, useState } from "react";
import type { GridRowId } from "@mui/x-data-grid";
import { AsyncSelectGridDialog } from "./_components/AsyncSelectGridDialog";

// ---------------- Base Props ----------------
type BaseFieldAsyncSelectGridProps<TItem extends Record<string, any>> = {
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  columns: any[];
  error?: boolean;
  helperText?: string;

  request: () => Promise<any>;
  extractRows?: (data: any) => TItem[];

  getRowId: (row: TItem) => GridRowId;
  getOptionLabel?: (item: TItem) => string | null | undefined;

  dialogHeight?: number | string;
  dialogMaxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false;
};

// ---------------- Single / Multiple Props ----------------
type AsyncSelectSingleProps<TItem extends Record<string, any>> =
  BaseFieldAsyncSelectGridProps<TItem> & {
    selectionMode?: "single";
    value?: any | null;
    onChange: (value: TItem | null) => void;
  };

type AsyncSelectMultipleProps<TItem extends Record<string, any>> =
  BaseFieldAsyncSelectGridProps<TItem> & {
    selectionMode: "multiple";
    value?: any[] | null;
    onChange: (value: TItem[] | null) => void;
  };

export type FieldAsyncSelectGridProps<TItem extends Record<string, any>> =
  | AsyncSelectSingleProps<TItem>
  | AsyncSelectMultipleProps<TItem>;

function FieldAsyncSelectGrid<TItem extends Record<string, any>>({
  label,
  placeholder,
  value,
  error,
  helperText,
  columns,
  disabled = false,
  selectionMode = "single",
  request,
  extractRows = (data) => data.items ?? [],
  getRowId,
  onChange,
  getOptionLabel = (item) => item?.name ?? Object.values(item)[1] ?? "",
  dialogHeight = 600,
  dialogMaxWidth = "sm",
}: FieldAsyncSelectGridProps<TItem>) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const displayValue =
    selectionMode === "single"
      ? value
        ? getOptionLabel(value as TItem)
        : ""
      : Array.isArray(value)
        ? value.map((v) => getOptionLabel(v)).join(", ")
        : "";

  const hasValue =
    selectionMode === "single"
      ? !!value
      : Array.isArray(value) && value.length > 0;

  const handleSelect = (selected: TItem | TItem[] | null) => {
    if (selectionMode === "multiple") {
      (onChange as (v: TItem[] | null) => void)(selected as TItem[] | null);
    } else {
      (onChange as (v: TItem | null) => void)(selected as TItem | null);
    }
    setDialogOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectionMode === "multiple") {
      (onChange as (v: TItem[] | null) => void)(null);
    } else {
      (onChange as (v: TItem | null) => void)(null);
    }
  };

  return (
    <>
      <TextField
        label={label}
        value={displayValue}
        placeholder={placeholder}
        size="small"
        fullWidth
        disabled={disabled}
        onClick={() => !disabled && setDialogOpen(true)}
        error={error}
        helperText={helperText}
        InputProps={{
          endAdornment: (
            <>
              {hasValue && !disabled && (
                <IconButton
                  size="small"
                  onClick={handleClear}
                  sx={{ mr: 0.5 }}
                  edge="end"
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              )}
              <IconButton
                size="small"
                onClick={() => !disabled && setDialogOpen(true)}
                disabled={disabled}
                edge="end"
              >
                <MoreHorizIcon fontSize="small" />
              </IconButton>
            </>
          ),
          readOnly: true,
        }}
      />

      <AsyncSelectGridDialog<TItem>
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={label}
        request={request}
        selected={value}
        extractRows={extractRows}
        columns={columns}
        selectionMode={selectionMode}
        getRowId={getRowId}
        onSelect={handleSelect}
        height={dialogHeight}
        maxWidth={dialogMaxWidth}
      />
    </>
  );
}

export default FieldAsyncSelectGrid;
