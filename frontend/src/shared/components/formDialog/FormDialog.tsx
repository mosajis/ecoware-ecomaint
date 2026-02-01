import React, {
  Suspense,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import DialogHeader from "../dialog/DialogHeader";
import FormDialogAction from "./FormDialogAction";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Spinner from "../Spinner";
import Alert from "@mui/material/Alert";
import type { DialogProps } from "@mui/material/Dialog";
import { useAtom, useAtomValue } from "jotai";
import { AtomApiError } from "@/shared/atoms/error.atom";

export type FormDialogWrapperProps = {
  readonly?: boolean;
  open: boolean;
  onClose: () => void;
  title: string;
  submitting?: boolean;
  loadingInitial?: boolean;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode; // می‌تونه lazy هم باشه
  cancelText?: string;
  submitText?: string;
  disabled?: boolean;
  hideHeader?: boolean;
  maxWidth?: DialogProps["maxWidth"];
};

export default function FormDialog({
  readonly,
  open,
  onClose,
  title,
  submitting = false,
  loadingInitial = false,
  onSubmit,
  children,
  hideHeader = false,
  cancelText = "Cancel",
  submitText = "Ok",
  disabled = false,
  maxWidth = "sm",
}: FormDialogWrapperProps) {
  const [error, setError] = useAtom(AtomApiError);

  useEffect(() => {
    if (open) setError(null);
  }, [open]);

  const isDisabled = useMemo(
    () => disabled || submitting || loadingInitial,
    [disabled, submitting, loadingInitial],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (readonly) return;

      setError(null);

      await onSubmit?.(e);
    },
    [onSubmit, readonly],
  );

  // 🔹 padding content
  const contentPadding = useMemo(() => (hideHeader ? 1 : 1.5), [hideHeader]);

  return (
    <Dialog
      open={open}
      onClose={isDisabled ? undefined : onClose}
      fullWidth
      maxWidth={maxWidth}
    >
      {!hideHeader && (
        <DialogHeader
          title={title}
          onClose={onClose}
          loading={loadingInitial}
          disabled={isDisabled}
        />
      )}

      <DialogContent dividers sx={{ p: contentPadding }}>
        {error && (
          <Alert
            severity="error"
            sx={{ mb: 1.5, border: "1px solid #a151517a" }}
          >
            {error.statusCode} - {error.message}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Suspense fallback={<Spinner />}>{children}</Suspense>

          <DialogActions sx={{ p: 0, m: 0, mt: 2 }}>
            {!readonly && (
              <FormDialogAction
                onCancel={onClose}
                submitting={submitting}
                cancelText={cancelText}
                submitText={submitText}
                disabled={isDisabled}
              />
            )}
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}
