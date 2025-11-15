import { Dialog, DialogContent, DialogActions } from "@mui/material";
import FormDialogAction from "./FormDialogAction";
import DialogHeader from "../dialog/DialogHeader";

export type FormDialogWrapperProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  submitting?: boolean;
  loadingInitial?: boolean;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void; // ⚡ حتماً event را بگیر
  children: React.ReactNode;
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
  submitText = "Ok",
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
      <DialogHeader
        title={title}
        onClose={onClose}
        loading={loadingInitial}
        disabled={isDisabled}
      />

      <DialogContent dividers>
        <form
          onSubmit={(e) => {
            e.preventDefault(); // جلوگیری از reload مرورگر
            onSubmit?.(e);
          }}
        >
          {children}
          <DialogActions sx={{ p: 0, m: 0, mt: 2 }}>
            <FormDialogAction
              onCancel={onClose}
              submitting={submitting}
              cancelText={cancelText}
              submitText={submitText}
              disabled={isDisabled}
            />
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}
