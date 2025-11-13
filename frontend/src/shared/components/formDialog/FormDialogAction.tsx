import { DialogActions, Button, CircularProgress } from "@mui/material";

type DialogActionsWrapperProps = {
  onCancel: () => void;
  submitting: boolean;
  cancelText?: string;
  submitText?: string;
  disabled?: boolean;
};

export default function FormDialogAction({
  onCancel,
  submitting,
  cancelText = "Cancel",
  submitText = "Ok",
  disabled = false,
}: DialogActionsWrapperProps) {
  const isDisabled = disabled || submitting;

  return (
    <>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{ flex: 1 }}
        disabled={isDisabled}
        startIcon={submitting && <CircularProgress size={18} />}
      >
        {submitText}
      </Button>
      <Button
        onClick={onCancel}
        color="inherit"
        variant="outlined"
        sx={{ flex: 1 }}
        disabled={isDisabled}
      >
        {cancelText}
      </Button>
    </>
  );
}
