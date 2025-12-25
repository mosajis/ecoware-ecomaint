import * as z from 'zod'
import FormDialog from '@/shared/components/formDialog/FormDialog'
import { memo, useEffect, useState, useCallback } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AsyncSelectField } from '@/shared/components/AsyncSelectField'
import { TypeUsers, users } from '@/core/api/generated/api'

// === Validation Schema ===
const schema = z.object({
  resourceName: z.string().min(1, 'Resource Name is required'),
  discipline: z.string().min(1, 'Discipline is required'),
  timeSpent: z.number().positive('Time Spent must be positive'),
})

export type ResourceFormValues = z.infer<typeof schema>

type TypeResourceUsed = {
  resourceId: number
  resourceName: string
  discipline: string
  timeSpent: number
}

type Props = {
  open: boolean
  mode: 'create' | 'update'
  recordId?: number | null
  onClose: () => void
  onSuccess: (data: TypeResourceUsed) => void
}

function StepResourceFormDialog({
  open,
  mode,
  recordId,
  onClose,
  onSuccess,
}: Props) {
  const [loadingInitial, setLoadingInitial] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const defaultValues: ResourceFormValues = {
    resourceName: '',
    discipline: '',
    timeSpent: 0,
  }

  const { control, handleSubmit, reset } = useForm<ResourceFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  // === Load record in edit mode ===
  const fetchData = useCallback(async () => {
    if (mode !== 'update' || !recordId) {
      reset(defaultValues)
      return
    }

    setLoadingInitial(true)

    try {
      // اینجا اگر API برای دریافت یک منبع داری، فراخوانی کن
      // const res = await tblResource.getById(recordId)
      // reset({...})
    } finally {
      setLoadingInitial(false)
    }
  }, [mode, recordId, reset])

  useEffect(() => {
    if (open) fetchData()
  }, [open, fetchData])

  const isDisabled = loadingInitial || submitting

  // === Submit Handler ===
  const handleFormSubmit = useCallback(
    async (values: ResourceFormValues) => {
      const parsed = schema.safeParse(values)
      if (!parsed.success) return

      try {
        setSubmitting(true)

        // ایجاد یا ویرایش منبع
        const result: TypeResourceUsed = {
          resourceId: recordId || Date.now(),
          resourceName: parsed.data.resourceName,
          discipline: parsed.data.discipline,
          timeSpent: parsed.data.timeSpent,
        }

        onSuccess(result)
        onClose()
      } finally {
        setSubmitting(false)
      }
    },
    [mode, recordId, onSuccess, onClose]
  )

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title={mode === 'create' ? 'Add Resource' : 'Edit Resource'}
      submitting={submitting}
      loadingInitial={loadingInitial}
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <Box display='grid' gridTemplateColumns='repeat(1, 1fr)' gap={1.5}>
        {/* Resource Name */}
        <AsyncSelectField<TypeUsers>
          columns={[
            {
              field: 'name',
              headerName: 'Name',
              flex: 1,
            },
            {
              field: 'name',
              headerName: 'Name',
              flex: 1,
            },
          ]}
          getRowId={row => row.userId}
          onChange={() => {}}
          request={users.getAll}
        />

        {/* Discipline */}
        <Controller
          name='discipline'
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label='Discipline *'
              size='small'
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              disabled={isDisabled}
            />
          )}
        />

        {/* Time Spent */}
        <Controller
          name='timeSpent'
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label='Time Spent *'
              type='number'
              size='small'
              inputProps={{ step: '0.5', min: '0' }}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              disabled={isDisabled}
              onChange={e => field.onChange(Number(e.target.value))}
            />
          )}
        />
      </Box>
    </FormDialog>
  )
}

export default memo(StepResourceFormDialog)
