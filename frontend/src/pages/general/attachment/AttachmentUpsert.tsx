import * as z from 'zod'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import FormDialog from '@/shared/components/formDialog/FormDialog'
import Switch from '@mui/material/Switch'
import FileField from '@/shared/components/FileField'
import AsyncSelect from '@/shared/components/AsyncSelect'
import FormControlLabel from '@mui/material/FormControlLabel'
import { memo, useEffect, useMemo, useCallback, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createAttachment } from './AttachmentService'
import {
  tblAttachment,
  TypeTblAttachment,
  tblAttachmentType,
} from '@/core/api/generated/api'

// === Validation Schema with Zod ===
const schema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  attachmentType: z
    .object({
      attachmentTypeId: z.number(),
      name: z.string(),
    })
    .nullable(),
  isUserAttachment: z.boolean(),
  file: z.instanceof(File, { message: 'File is required' }),
})

export type AttachmentFormValues = z.infer<typeof schema>

type Props = {
  open: boolean
  mode: 'create' | 'update'
  recordId?: number
  onClose: () => void
  onSuccess: (data: TypeTblAttachment) => void
}

function AttachmentUpsert({ open, mode, recordId, onClose, onSuccess }: Props) {
  const [submitting, setSubmitting] = useState(false)

  const defaultValues: AttachmentFormValues = useMemo(
    () => ({
      title: '',
      attachmentType: null,
      isUserAttachment: true,
      file: new File([], ''),
    }),
    []
  )

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AttachmentFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onChange',
  })

  const selectedFile = watch('file')

  useEffect(() => {
    const fileName = selectedFile?.name?.trim()

    if (!fileName) {
      setValue('title', '')
      return
    }

    const lastDotIndex = fileName.lastIndexOf('.')
    const nameWithoutExtension =
      lastDotIndex === -1 ? fileName : fileName.substring(0, lastDotIndex)

    const currentTitle = watch('title')

    if (!currentTitle?.trim()) {
      setValue('title', nameWithoutExtension)
    }
  }, [selectedFile, setValue, watch])

  // === بارگذاری داده اولیه در حالت update ===
  const fetchData = useCallback(async () => {
    if (mode === 'update' && recordId) {
      try {
        const res = await tblAttachment.getById(recordId, {
          include: { tblAttachmentType: true },
        })

        if (res) {
          reset({
            title: res.title ?? '',
            attachmentType: res.tblAttachmentType
              ? {
                  attachmentTypeId: res.tblAttachmentType.attachmentTypeId,
                  name: res.tblAttachmentType.name ?? '',
                }
              : { attachmentTypeId: 0, name: '' },
            isUserAttachment: res.isUserAttachment ?? true,
            file: new File([], ''), // در update، فایل جدید آپلود می‌شه
          })
        }
      } catch (err) {
        console.error('Failed to load attachment data', err)
      }
    } else {
      reset(defaultValues)
    }
  }, [mode, recordId, reset, defaultValues])

  useEffect(() => {
    if (open) fetchData()
  }, [open, fetchData])

  const isDisabled = submitting

  // === ارسال فرم ===
  const handleFormSubmit = useCallback(
    async (values: AttachmentFormValues) => {
      setSubmitting(true)
      try {
        const payload = {
          title: values.title,
          attachmentTypeId: values?.attachmentType?.attachmentTypeId || 0,
          isUserAttachment: values.isUserAttachment,
          file: values.file,
          createdUserId: 1,
        }

        let result: TypeTblAttachment | undefined

        if (mode === 'create') {
          result = await createAttachment(payload)
        } else if (mode === 'update' && recordId) {
          result = await tblAttachment.update(recordId, payload)
        }

        if (result) {
          onSuccess(result)
          onClose()
        }
      } catch (err) {
        console.error('Failed to submit attachment form', err)
      } finally {
        setSubmitting(false)
      }
    },
    [mode, recordId, onSuccess, onClose]
  )

  return (
    <FormDialog
      open={open}
      maxWidth='sm'
      onClose={onClose}
      title={mode === 'create' ? 'Create Attachment' : 'Edit Attachment'}
      submitting={submitting}
      loadingInitial={false}
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <Box display='flex' flexDirection='column' gap={2}>
        {/* آپلود فایل */}
        <Controller
          name='file'
          control={control}
          render={({ field: { onChange } }) => (
            <FileField
              label='Attachment File *'
              onChange={onChange}
              error={!!errors.file}
              helperText={errors.file?.message as string}
              disabled={isDisabled || mode === 'update'}
              required
              placeholder='Click to upload or drag and drop file'
            />
          )}
        />

        {/* عنوان */}
        <Controller
          name='title'
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label='Title *'
              size='small'
              fullWidth
              error={!!errors.title}
              helperText={errors.title?.message}
              disabled={isDisabled}
            />
          )}
        />
        {/* نوع پیوست */}
        <Controller
          name='attachmentType'
          control={control}
          render={({ field, fieldState }) => (
            <AsyncSelect
              {...field}
              value={field.value}
              onChange={field.onChange}
              label='Attachment Type *'
              request={tblAttachmentType.getAll}
              getOptionLabel={row => row.name}
              error={!!fieldState.error?.message}
              helperText={fieldState.error?.message}
            />
          )}
        />

        {/* سوئیچ */}
        <Controller
          name='isUserAttachment'
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Switch
                  checked={field.value}
                  onChange={field.onChange}
                  disabled={isDisabled}
                />
              }
              label='User Attachment'
            />
          )}
        />
      </Box>
    </FormDialog>
  )
}

export default memo(AttachmentUpsert)
