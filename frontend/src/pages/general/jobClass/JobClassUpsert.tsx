import * as z from 'zod'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import FormDialog from '@/shared/components/formDialog/FormDialog'
import { memo, useEffect, useState, useCallback, useMemo } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { tblJobClass, TypeTblJobClass } from '@/core/api/generated/api'
import { requiredStringField } from '@/core/api/helper'
import NumberField from '@/shared/components/NumberField'

// === Validation Schema ===
const schema = z.object({
  code: requiredStringField(),
  name: requiredStringField(),
  orderNo: z.number().nullable(),
})

export type JobClassFormValues = z.infer<typeof schema>

type Props = {
  open: boolean
  mode: 'create' | 'update'
  recordId?: number | null
  onClose: () => void
  onSuccess: (data: TypeTblJobClass) => void
}

function JobClassUpsert({ open, mode, recordId, onClose, onSuccess }: Props) {
  const [loadingInitial, setLoadingInitial] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // === Default values ===
  const defaultValues: JobClassFormValues = useMemo(
    () => ({
      code: '',
      name: '',
      orderNo: null,
    }),
    []
  )

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<JobClassFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  // === Fetch data for update mode ===
  const fetchData = useCallback(async () => {
    if (mode === 'update' && recordId) {
      setLoadingInitial(true)
      try {
        const res = await tblJobClass.getById(recordId)
        if (res) {
          reset({
            code: res.code ?? '',
            name: res.name ?? '',
            orderNo: res.orderNo,
          })
        }
      } catch (err) {
        console.error('Failed to fetch JobClass', err)
        reset(defaultValues)
      } finally {
        setLoadingInitial(false)
      }
    } else {
      reset(defaultValues)
    }
  }, [mode, recordId, reset, defaultValues])

  useEffect(() => {
    if (open) fetchData()
  }, [open, fetchData])

  const isDisabled = loadingInitial || submitting

  // === Submit handler ===
  const handleFormSubmit = useCallback(
    async (values: JobClassFormValues) => {
      setSubmitting(true)
      try {
        let result: TypeTblJobClass
        if (mode === 'create') {
          result = await tblJobClass.create(values)
        } else if (mode === 'update' && recordId) {
          result = await tblJobClass.update(recordId, values)
        } else {
          return
        }
        onSuccess(result)
        onClose()
      } catch (err) {
        console.error('Submit failed', err)
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
      title={mode === 'create' ? 'Create Job Class' : 'Edit Job Class'}
      submitting={submitting}
      loadingInitial={loadingInitial}
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <Box display='grid' gridTemplateColumns='repeat(1, 1fr)' gap={1.5}>
        <Controller
          name='code'
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label='Code *'
              size='small'
              error={!!errors.code}
              helperText={errors.code?.message}
              disabled={isDisabled}
              sx={{ gridColumn: 'span 2' }}
            />
          )}
        />

        <Controller
          name='name'
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label='Name *'
              size='small'
              error={!!errors.name}
              helperText={errors.name?.message}
              disabled={isDisabled}
              sx={{ gridColumn: 'span 2' }}
            />
          )}
        />
        <Controller
          name='orderNo'
          control={control}
          render={({ field }) => (
            <NumberField
              {...field}
              label='Order No'
              size='small'
              error={!!errors.orderNo}
              helperText={errors.orderNo?.message}
              disabled={isDisabled}
            />
          )}
        />
      </Box>
    </FormDialog>
  )
}

export default memo(JobClassUpsert)
