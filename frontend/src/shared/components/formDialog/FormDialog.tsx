import React, { Suspense } from 'react'
import DialogHeader from '../dialog/DialogHeader'
import FormDialogAction from './FormDialogAction'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import type { DialogProps } from '@mui/material/Dialog'
import Spinner from '../Spinner'

export type FormDialogWrapperProps = {
  readonly?: boolean
  open: boolean
  onClose: () => void
  title: string
  submitting?: boolean
  loadingInitial?: boolean
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void
  children: React.ReactNode // این می‌تونه lazy هم باشه
  cancelText?: string
  submitText?: string
  disabled?: boolean
  hideHeader?: boolean
  maxWidth?: DialogProps['maxWidth']
}

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
  cancelText = 'Cancel',
  submitText = 'Ok',
  disabled = false,
  maxWidth = 'sm',
}: FormDialogWrapperProps) {
  const isDisabled = disabled || submitting || loadingInitial

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

      <DialogContent dividers sx={{ p: 1 }}>
        <form
          onSubmit={e => {
            e.preventDefault()
            if (!readonly) {
              onSubmit?.(e)
            }
          }}
        >
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
  )
}
