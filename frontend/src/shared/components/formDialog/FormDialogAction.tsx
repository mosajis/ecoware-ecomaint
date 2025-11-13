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
  submitText = "Submit",
  disabled = false,
}: DialogActionsWrapperProps) {
  const isDisabled = disabled || submitting;

  return (
    <DialogActions sx={{ display: "flex" }}>
      <Button
        onClick={onCancel}
        color="inherit"
        variant="outlined"
        sx={{ flex: 1 }}
        disabled={isDisabled}
      >
        {cancelText}
      </Button>
      <Button
        type="submit"
        form="dynamic-form"
        variant="contained"
        color="primary"
        sx={{ flex: 1 }}
        disabled={isDisabled}
        startIcon={submitting && <CircularProgress size={18} />}
      >
        {submitText}
      </Button>
    </DialogActions>
  );
}
