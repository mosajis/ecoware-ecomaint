import {
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  Box,
  Typography,
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import DialogHeader from "./dialog/DialogHeader";

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message?: string;
  icon?: React.ReactNode;

  confirmText?: string;
  cancelText?: string;

  confirmColor?: "primary" | "error" | "warning" | "success";
  onConfirm: () => void;
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
  return (
    <Dialog open={open} onClose={onCancel} fullWidth maxWidth={maxWidth}>
      <DialogHeader title={title} onClose={onCancel} />

      <DialogContent dividers sx={{ py: 5 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
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
          onClick={onConfirm}
          color={confirmColor}
          variant="contained"
        >
          {confirmText}
        </Button>

        <Button sx={{ flex: 1 }} onClick={onCancel} color="inherit">
          {cancelText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
