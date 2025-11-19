import DialogHeader from "./dialog/DialogHeader";
import CustomizedDataGrid from "./dataGrid/DataGrid";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from "@mui/material";

interface SelectModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  request: () => Promise<any[]>;
  columns: any[];
  selectionMode?: "single" | "multiple";
  onSelect: (selected: any[] | any) => void;
}

export default function AsyncSelectDialog({
  open,
  onClose,
  title = "انتخاب",
  request,
  columns,
  onSelect,
  selectionMode = "single",
}: SelectModalProps) {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selection, setSelection] = useState<any[]>([]);

  // Load data when modal opens
  useEffect(() => {
    if (!open) return;

    setLoading(true);
    request()
      .then((data) => setRows(data))
      .finally(() => setLoading(false));
  }, [open]);

  const handleOk = () => {
    if (selectionMode === "single") {
      onSelect(selection[0] || null);
    } else {
      onSelect(selection);
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogHeader title={title} onClose={onClose} />

      <DialogContent sx={{ pt: 1 }}>
        <Box height={400}>
          <CustomizedDataGrid
            rows={rows}
            columns={columns}
            loading={loading}
            checkboxSelection={selectionMode === "multiple"}
            disableRowSelectionOnClick={false}
            onRowSelectionModelChange={(newSelection) =>
              setSelection(
                Array.isArray(newSelection) ? newSelection : [newSelection]
              )
            }
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          انصراف
        </Button>
        <Button
          variant="contained"
          onClick={handleOk}
          disabled={selection.length === 0}
        >
          تایید
        </Button>
      </DialogActions>
    </Dialog>
  );
}
