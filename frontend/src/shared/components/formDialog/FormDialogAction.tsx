import Button from "@mui/material/Button";
import IconCheck from "@mui/icons-material/Check";
import IconClose from "@mui/icons-material/Close";

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
        color="secondary"
        sx={{ flex: 1 }}
        disabled={isDisabled}
        loading={submitting}
        startIcon={<IconCheck />}
      >
        {submitText}
      </Button>
      <Button
        onClick={onCancel}
        color="inherit"
        variant="outlined"
        sx={{ flex: 1 }}
        disabled={isDisabled}
        startIcon={<IconClose />}
      >
        {cancelText}
      </Button>
    </>
  );
}
