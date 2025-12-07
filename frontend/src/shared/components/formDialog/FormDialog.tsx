import React, { Suspense } from "react";
import DialogHeader from "../dialog/DialogHeader";
import FormDialogAction from "./FormDialogAction";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import type { DialogProps } from "@mui/material/Dialog";
import Spinner from "../Spinner";

export type FormDialogWrapperProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  submitting?: boolean;
  loadingInitial?: boolean;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode; // این می‌تونه lazy هم باشه
  cancelText?: string;
  submitText?: string;
  disabled?: boolean;
  maxWidth?: DialogProps["maxWidth"];
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
  maxWidth = "sm",
}: FormDialogWrapperProps) {
  const isDisabled = disabled || submitting || loadingInitial;

  return (
    <Dialog
      open={open}
      onClose={isDisabled ? undefined : onClose}
      fullWidth
      maxWidth={maxWidth}
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
            e.preventDefault();
            onSubmit?.(e);
          }}
        >
          <Suspense fallback={<Spinner />}>{children}</Suspense>

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
