import IconCheck from "@mui/icons-material/Check";
import IconClose from "@mui/icons-material/Close";
import Button from "@mui/material/Button";

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
        data-cy="form-submit"
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
        data-cy="form-cancel"
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
