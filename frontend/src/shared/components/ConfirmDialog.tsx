import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import DialogHeader from "./dialog/DialogHeader";
import { useEffect, useState } from "react";

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message?: string;
  icon?: React.ReactNode;

  confirmText?: string;
  cancelText?: string;

  confirmColor?: "primary" | "error" | "warning" | "success";
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;

  maxWidth?: "xs" | "sm" | "md" | "lg";
}

export default function ConfirmDialog({
  open,
  title = "Confirm",
  message = "Are you sure?",
  icon = (
    <WarningAmberIcon
      color="error"
      sx={{
        fontSize: "3rem",
      }}
    />
  ),
  confirmText = "Delete",
  cancelText = "Cancel",
  confirmColor = "error",
  maxWidth = "xs",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [loading, setLoading] = useState(false);

  // Reset loading when modal closes
  useEffect(() => {
    if (!open) setLoading(false);
  }, [open]);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onCancel}
      fullWidth
      maxWidth={maxWidth}
    >
      <DialogHeader title={title} onClose={loading ? undefined : onCancel} />

      <DialogContent dividers sx={{ py: 5 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {icon}
          <Typography>{message}</Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ display: "flex" }}>
        <Button
          sx={{ flex: 1 }}
          variant="contained"
          color={confirmColor}
          loading={loading}
          onClick={handleConfirm}
        >
          {confirmText}
        </Button>

        <Button
          sx={{ flex: 1 }}
          onClick={onCancel}
          disabled={loading}
          color="inherit"
        >
          {cancelText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
