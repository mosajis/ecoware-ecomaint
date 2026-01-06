import { memo } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import FileField from '@/shared/components/FileField'
import AsyncSelect from '@/shared/components/AsyncSelect'
import { Controller, UseFormReturn } from 'react-hook-form'
import { tblAttachmentType } from '@/core/api/generated/api'
import { NewAttachmentFormValues } from '../AttachmentType'

interface NewAttachmentTabProps {
  form: UseFormReturn<NewAttachmentFormValues>
  disabled: boolean
}

function NewAttachmentTab({ form, disabled }: NewAttachmentTabProps) {
  return (
    <Box display='flex' flexDirection='column' gap={2}>
      <Controller
        name='file'
        control={form.control}
        render={({ field: { onChange } }) => (
          <FileField
            label='Attachment File *'
            onChange={onChange}
            error={!!form.formState.errors.file}
            helperText={form.formState.errors.file?.message as string}
            disabled={disabled}
            required
            placeholder='Click to upload or drag and drop file'
          />
        )}
      />

      <Controller
        name='title'
        control={form.control}
        render={({ field }) => (
          <TextField
            {...field}
            label='Title *'
            size='small'
            fullWidth
            error={!!form.formState.errors.title}
            helperText={form.formState.errors.title?.message}
            disabled={disabled}
          />
        )}
      />

      <Controller
        name='attachmentType'
        control={form.control}
        render={({ field, fieldState }) => (
          <AsyncSelect
            {...field}
            value={field.value}
            onChange={field.onChange}
            label='Attachment Type'
            request={tblAttachmentType.getAll}
            getOptionLabel={row => row.name}
            error={!!fieldState.error?.message}
            helperText={fieldState.error?.message}
            disabled={disabled}
          />
        )}
      />

      <Controller
        name='isUserAttachment'
        control={form.control}
        render={({ field }) => (
          <FormControlLabel
            control={
              <Switch
                checked={field.value}
                onChange={field.onChange}
                disabled={disabled}
              />
            }
            label='User Attachment'
          />
        )}
      />
    </Box>
  )
}

export default memo(NewAttachmentTab)
