import { Dialog, DialogContent, CircularProgress } from "@mui/material";
import FormDialogHeader from "./FormDialogHeader";
import FormDialogAction from "./FormDialogAction";
import Spinner from "../Spinner";

export type FormDialogWrapperProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  submitting?: boolean;
  loadingInitial?: boolean;
  onSubmit?: () => void;
  children: React.ReactNode; // محتوای فرم
  cancelText?: string;
  submitText?: string;
  disabled?: boolean;
};

export default function FormDialog({
  open,
  onClose,
  title,
  submitting = false,
  loadingInitial = false,
  onSubmit,
  children,
  cancelText = "Cancel",
  submitText = "Submit",
  disabled = false,
}: FormDialogWrapperProps) {
  const isDisabled = disabled || submitting || loadingInitial;

  return (
    <Dialog
      open={open}
      onClose={isDisabled ? undefined : onClose}
      fullWidth
      maxWidth="sm"
    >
      <FormDialogHeader
        title={title}
        onClose={onClose}
        loading={loadingInitial}
        disabled={isDisabled}
      />

      <DialogContent dividers>
        <form onSubmit={onSubmit}>{children}</form>
      </DialogContent>

      <FormDialogAction
        onCancel={onClose}
        submitting={submitting}
        cancelText={cancelText}
        submitText={submitText}
        disabled={isDisabled}
      />
    </Dialog>
  );
}
