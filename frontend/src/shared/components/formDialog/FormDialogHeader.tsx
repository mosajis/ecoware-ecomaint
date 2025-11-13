import { DialogTitle, IconButton, CircularProgress } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

type DialogHeaderProps = {
  title: string;
  onClose?: () => void;
  loading?: boolean;
  disabled?: boolean;
};

export default function FormDialogHeader({
  title,
  onClose,
  loading = false,
  disabled = false,
}: DialogHeaderProps) {
  return (
    <DialogTitle
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        p: "0.6rem 1rem",
      }}
    >
      {title}
      <IconButton
        size="small"
        onClick={onClose}
        disabled={disabled}
        loading={loading}
      >
        <CloseIcon />
      </IconButton>
    </DialogTitle>
  );
}
