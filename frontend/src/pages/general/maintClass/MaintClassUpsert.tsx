import * as z from 'zod'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import FormDialog from '@/shared/components/formDialog/FormDialog'
import NumberField from '@/shared/components/NumberField'
import { memo, useEffect, useMemo, useState, useCallback } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { tblMaintClass, TypeTblMaintClass } from '@/core/api/generated/api'
import { requiredStringField } from '@/core/api/helper'

const schema = z.object({
  description: requiredStringField(),
  orderNo: z.number().nullable(),
})

export type MaintClassFormValues = z.infer<typeof schema>

type Props = {
  open: boolean
  mode: 'create' | 'update'
  recordId?: number | null
  onClose: () => void
  onSuccess: (data: TypeTblMaintClass) => void
}

function MaintClassUpsert({ open, mode, recordId, onClose, onSuccess }: Props) {
  const [loadingInitial, setLoadingInitial] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const defaultValues: MaintClassFormValues = useMemo(
    () => ({ description: '', orderNo: null }),
    []
  )

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MaintClassFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  const fetchData = useCallback(async () => {
    if (mode === 'update' && recordId) {
      setLoadingInitial(true)
      try {
        const res = await tblMaintClass.getById(recordId)
        reset({ description: res?.descr ?? '', orderNo: res.orderNo })
      } catch (err) {
        console.error('Failed to fetch MaintClass', err)
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

  const handleFormSubmit = useCallback(
    async (values: MaintClassFormValues) => {
      setSubmitting(true)
      try {
        let result: TypeTblMaintClass
        if (mode === 'create') {
          result = await tblMaintClass.create({
            descr: values.description,
            orderNo: values.orderNo,
          })
        } else if (mode === 'update' && recordId) {
          result = await tblMaintClass.update(recordId, {
            descr: values.description,
            orderNo: values.orderNo,
          })
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
      title={mode === 'create' ? 'Create Maint Class' : 'Edit Maint Class'}
      submitting={submitting}
      loadingInitial={loadingInitial}
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <Box display='grid' gridTemplateColumns='repeat(4, 1fr)' gap={1.5}>
        <Controller
          name='description'
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label='Description *'
              size='small'
              error={!!errors.description}
              helperText={errors.description?.message}
              disabled={isDisabled}
              sx={{ gridColumn: 'span 4' }}
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

export default memo(MaintClassUpsert)
