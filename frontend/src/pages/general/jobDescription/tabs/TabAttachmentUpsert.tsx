import * as z from 'zod'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import FormDialog from '@/shared/components/formDialog/FormDialog'
import Switch from '@mui/material/Switch'
import FileField from '@/shared/components/FileField'
import AsyncSelect from '@/shared/components/AsyncSelect'
import FormControlLabel from '@mui/material/FormControlLabel'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { memo, useEffect, useMemo, useCallback, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createAttachment } from '../../attachment/attachmentService'
import {
  tblAttachment,
  TypeTblAttachment,
  tblAttachmentType,
  tblJobDescriptionAttachment,
  TypeTblJobDescriptionAttachment,
} from '@/core/api/generated/api'
import { GridColDef, GridRowSelectionModel } from '@mui/x-data-grid'
import DataGrid from '@/shared/components/dataGrid/DataGrid'

// === Validation Schema for Existing Attachment ===
const existingSchema = z.object({})

type ExistingAttachmentFormValues = z.infer<typeof existingSchema>

// === Validation Schema for New Attachment ===
const newSchema = z.object({
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

type NewAttachmentFormValues = z.infer<typeof newSchema>

type Props = {
  open: boolean
  mode: 'create' | 'update'
  jobDescId: number
  recordId?: number
  onClose: () => void
  onSuccess: (data: TypeTblJobDescriptionAttachment) => void
}

// === ستون‌های DataGrid ===
const attachmentColumns: GridColDef[] = [
  { field: 'attachmentId', headerName: 'ID', width: 80 },
  { field: 'title', headerName: 'Title', flex: 1 },
  { field: 'fileName', headerName: 'File Name', flex: 1 },
  {
    field: 'attachmentType',
    headerName: 'Type',
    width: 150,
    valueGetter: (_, row) => row?.tblAttachmentType?.name ?? '',
  },
]

function JobDescriptionAttachmentUpsert({
  open,
  mode,
  jobDescId,
  recordId,
  onClose,
  onSuccess,
}: Props) {
  const [activeTab, setActiveTab] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [selectedAttachmentId, setSelectedAttachmentId] = useState<
    number | null
  >(null)
  const [attachments, setAttachments] = useState<TypeTblAttachment[]>([])
  const [loadingAttachments, setLoadingAttachments] = useState(false)

  // === فرم برای انتخاب Attachment موجود ===
  const existingForm = useForm<ExistingAttachmentFormValues>({
    resolver: zodResolver(existingSchema),
    defaultValues: {},
    mode: 'onChange',
  })

  // === فرم برای آپلود Attachment جدید ===
  const newForm = useForm<NewAttachmentFormValues>({
    resolver: zodResolver(newSchema),
    defaultValues: {
      title: '',
      attachmentType: null,
      isUserAttachment: true,
      file: new File([], ''),
    },
    mode: 'onChange',
  })

  const selectedFile = newForm.watch('file')

  // === تنظیم عنوان بر اساس نام فایل ===
  useEffect(() => {
    const fileName = selectedFile?.name?.trim()
    if (!fileName) {
      newForm.setValue('title', '')
      return
    }

    const lastDotIndex = fileName.lastIndexOf('.')
    const nameWithoutExtension =
      lastDotIndex === -1 ? fileName : fileName.substring(0, lastDotIndex)

    const currentTitle = newForm.watch('title')
    if (!currentTitle?.trim()) {
      newForm.setValue('title', nameWithoutExtension)
    }
  }, [selectedFile, newForm])

  // === بارگذاری لیست Attachments ===
  const loadAttachments = useCallback(async () => {
    setLoadingAttachments(true)
    try {
      const res = await tblAttachment.getAll({
        include: { tblAttachmentType: true },
      })
      setAttachments(res.items ?? [])
    } catch (err) {
      console.error('Failed to load attachments', err)
    } finally {
      setLoadingAttachments(false)
    }
  }, [])

  // === بارگذاری داده در حالت update ===
  const fetchData = useCallback(async () => {
    if (mode === 'update' && recordId) {
      try {
        const res = await tblJobDescriptionAttachment.getById(recordId, {
          include: { tblAttachment: { include: { tblAttachmentType: true } } },
        })

        if (res) {
          existingForm.reset({})
          setSelectedAttachmentId(res.tblAttachment?.attachmentId ?? null)
        }
      } catch (err) {
        console.error('Failed to load job description attachment', err)
      }
    } else {
      existingForm.reset({})
      newForm.reset({
        title: '',
        attachmentType: null,
        isUserAttachment: true,
        file: new File([], ''),
      })
      setSelectedAttachmentId(null)
    }
  }, [mode, recordId, existingForm, newForm])

  useEffect(() => {
    if (open) {
      fetchData()
      loadAttachments()
    }
  }, [open, fetchData, loadAttachments])

  const isDisabled = submitting

  // === Submit برای Attachment موجود ===
  const handleExistingSubmit = useCallback(
    async (values: ExistingAttachmentFormValues) => {
      if (!selectedAttachmentId) {
        alert('Please select an attachment')
        return
      }

      setSubmitting(true)
      try {
        const mapPayload = {
          jobDescId: jobDescId,
          attachmentId: selectedAttachmentId,
          orderNo: 0,
          createdUserId: 1,
        }

        let result: TypeTblJobDescriptionAttachment | undefined

        if (mode === 'create') {
          result = await tblJobDescriptionAttachment.create(mapPayload as any)
        } else if (mode === 'update' && recordId) {
          result = await tblJobDescriptionAttachment.update(
            recordId,
            mapPayload
          )
        }

        if (result) {
          onSuccess(result)
          onClose()
        }
      } catch (err) {
        console.error('Failed to submit existing attachment', err)
      } finally {
        setSubmitting(false)
      }
    },
    [selectedAttachmentId, mode, recordId, jobDescId, onSuccess, onClose]
  )

  // === Submit برای Attachment جدید ===
  const handleNewSubmit = useCallback(
    async (values: NewAttachmentFormValues) => {
      setSubmitting(true)
      try {
        // ایجاد attachment جدید
        const newAttachment = await createAttachment({
          title: values.title,
          attachmentTypeId: values.attachmentType?.attachmentTypeId || 0,
          isUserAttachment: values.isUserAttachment,
          file: values.file,
          createdUserId: 1,
        })

        if (!newAttachment) {
          throw new Error('Failed to create attachment')
        }

        // ایجاد رکورد map
        const mapPayload = {
          jobDescId: jobDescId,
          attachmentId: newAttachment.attachmentId,
          orderNo: 0,
          createdUserId: 1,
        }

        let result: TypeTblJobDescriptionAttachment | undefined

        if (mode === 'create') {
          result = await tblJobDescriptionAttachment.create(mapPayload as any)
        } else if (mode === 'update' && recordId) {
          result = await tblJobDescriptionAttachment.update(
            recordId,
            mapPayload
          )
        }

        if (result) {
          onSuccess(result)
          onClose()
        }
      } catch (err) {
        console.error('Failed to submit new attachment', err)
      } finally {
        setSubmitting(false)
      }
    },
    [mode, recordId, jobDescId, onSuccess, onClose]
  )

  return (
    <FormDialog
      open={open}
      maxWidth='md'
      onClose={onClose}
      title={
        mode === 'create'
          ? 'Add Attachment to Job Description'
          : 'Edit Job Description Attachment'
      }
      submitting={submitting}
      loadingInitial={loadingAttachments}
      onSubmit={
        activeTab === 0
          ? existingForm.handleSubmit(handleExistingSubmit)
          : newForm.handleSubmit(handleNewSubmit)
      }
      // submitDisabled={activeTab === 0 && !selectedAttachmentId}
    >
      <Tabs
        value={activeTab}
        onChange={(_, newValue) => setActiveTab(newValue)}
        sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
      >
        <Tab label='Select Existing Attachment' />
        <Tab label='Upload New Attachment' />
      </Tabs>

      {/* Tab 1: انتخاب Attachment موجود */}
      {activeTab === 0 && (
        <Box display='flex' flexDirection='column' gap={2}>
          <DataGrid
            rows={attachments}
            columns={attachmentColumns}
            loading={loadingAttachments}
            getRowId={row => row.attachmentId}
            label='Attachments'
            checkboxSelection
            disableMultipleRowSelection
            // rowSelectionModel={selectedAttachmentId ? [selectedAttachmentId] : []}
            // onRowSelectionModelChange={(model: GridRowSelectionModel) => {
            //   setSelectedAttachmentId(model[0] as number ?? null)
            // }}
            disableAdd
            disableRefresh
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            sx={{ height: 400 }}
          />
        </Box>
      )}

      {/* Tab 2: آپلود Attachment جدید */}
      {activeTab === 1 && (
        <Box display='flex' flexDirection='column' gap={2}>
          <Controller
            name='file'
            control={newForm.control}
            render={({ field: { onChange } }) => (
              <FileField
                label='Attachment File *'
                onChange={onChange}
                error={!!newForm.formState.errors.file}
                helperText={newForm.formState.errors.file?.message as string}
                disabled={isDisabled}
                required
                placeholder='Click to upload or drag and drop file'
              />
            )}
          />

          <Controller
            name='title'
            control={newForm.control}
            render={({ field }) => (
              <TextField
                {...field}
                label='Title *'
                size='small'
                fullWidth
                error={!!newForm.formState.errors.title}
                helperText={newForm.formState.errors.title?.message}
                disabled={isDisabled}
              />
            )}
          />

          <Controller
            name='attachmentType'
            control={newForm.control}
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
                disabled={isDisabled}
              />
            )}
          />

          <Controller
            name='isUserAttachment'
            control={newForm.control}
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
      )}
    </FormDialog>
  )
}

export default memo(JobDescriptionAttachmentUpsert)
