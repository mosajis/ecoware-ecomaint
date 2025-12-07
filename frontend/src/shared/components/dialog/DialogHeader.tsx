import DialogTitle from "@mui/material/DialogTitle";
import type { DialogTitleProps } from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import CloseIcon from "@mui/icons-material/Close";

type DialogHeaderProps = DialogTitleProps & {
  title: string;
  onClose?: () => void;
  loading?: boolean;
  disabled?: boolean;
};

export default function DialogHeader({
  title,
  onClose,
  loading = false,
  disabled = false,
  ...props
}: DialogHeaderProps) {
  return (
    <DialogTitle
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        p: "0.6rem 1rem",
        ...(props.sx || {}), // merge custom sx if passed
      }}
      {...props} // spread باقی props به DialogTitle
    >
      {title}
      <IconButton size="small" onClick={onClose} disabled={disabled}>
        {loading ? <CircularProgress size={16} /> : <CloseIcon />}
      </IconButton>
    </DialogTitle>
  );
}
