import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useState } from "react";
import { TextField } from "@mui/material";
import { AsyncSelectDialog } from "./AsyncSelectDialog";
import type { GridRowId } from "@mui/x-data-grid";

export type AsyncSelectFieldProps<TItem extends Record<string, any>> = {
  label?: string;
  placeholder?: string;
  value?: TItem | TItem[] | null;
  disabled?: boolean;
  selectionMode?: "single" | "multiple";
  columns: any[];
  error?: boolean;
  helperText?: string;

  request: () => Promise<any>;
  extractRows?: (data: any) => TItem[];
  getRowId: (row: TItem) => GridRowId;
  onChange: (value: TItem | TItem[] | null) => void;

  dialogHeight?: number | string;
  dialogMaxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false;
};

export function AsyncSelectField<TItem extends Record<string, any>>({
  label,
  placeholder,
  value,
  disabled = false,
  selectionMode = "single",
  request,
  extractRows,
  columns,
  getRowId,
  onChange,
  error,
  helperText,
  dialogHeight = 600,
  dialogMaxWidth = "md",
}: AsyncSelectFieldProps<TItem>) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const displayValue =
    selectionMode === "single"
      ? value
        ? (value as TItem).name
        : ""
      : Array.isArray(value)
        ? (value as TItem[]).map((v) => v.name).join(", ")
        : "";

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
        slotProps={{
          input: {
            endAdornment: <MoreHorizIcon />,
          },
        }}
      />

      <AsyncSelectDialog<TItem>
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={label}
        request={request}
        extractRows={extractRows}
        columns={columns}
        selectionMode={selectionMode}
        getRowId={getRowId}
        onSelect={(selected) => {
          onChange(selected);
          setDialogOpen(false);
        }}
        height={dialogHeight}
        maxWidth={dialogMaxWidth}
      />
    </>
  );
}
