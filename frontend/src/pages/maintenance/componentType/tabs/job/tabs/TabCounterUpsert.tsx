import * as z from 'zod'
import { memo, useCallback, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Box from '@mui/material/Box'
import FormDialog from '@/shared/components/formDialog/FormDialog'
import NumberField from '@/shared/components/NumberField'
import { AsyncSelectField } from '@/shared/components/AsyncSelectField'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import {
  tblCompTypeJobCounter,
  tblCompTypeCounter,
  TypeTblCompTypeJobCounter,
} from '@/core/api/generated/api'
import { buildRelation } from '@/core/api/helper'

/* === Schema === */
const schema = z.object({
  compTypeCounter: z.object({
    compTypeCounterId: z.number(),
  }),
  frequency: z.number().nullable(),
  window: z.number().nullable(),
  showInAlert: z.boolean(),
  updateByFunction: z.boolean(),
  orderNo: z.number().nullable(),
})

type FormValues = z.infer<typeof schema>

type Props = {
  open: boolean
  mode: 'create' | 'update'
  recordId?: number | null
  compTypeJobId: number
  compTypeId: number
  onClose: () => void
  onSuccess: (data: TypeTblCompTypeJobCounter) => void
}

function JobCounterUpsert({
  open,
  mode,
  recordId,
  compTypeJobId,
  compTypeId,
  onClose,
  onSuccess,
}: Props) {
  const [loadingInitial, setLoadingInitial] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const defaultValues: FormValues = {
    compTypeCounter: null as any,
    frequency: null,
    window: null,
    showInAlert: true,
    updateByFunction: false,
    orderNo: null,
  }

  const { control, handleSubmit, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  // === Load edit ===
  const fetchData = useCallback(async () => {
    if (mode !== 'update' || !recordId) {
      reset(defaultValues)
      return
    }

    setLoadingInitial(true)
    try {
      const res = await tblCompTypeJobCounter.getById(recordId, {
        include: { tblCompTypeCounter: true },
      })

      reset({
        compTypeCounter: res.tblCompTypeCounter
          ? {
              compTypeCounterId: res.tblCompTypeCounter.compTypeCounterId,
            }
          : undefined,
        frequency: res.frequency ?? null,
        window: res.window ?? null,
        showInAlert: res.showInAlert ?? false,
        updateByFunction: res.updateByFunction ?? false,
        orderNo: res.orderNo ?? null,
      })
    } finally {
      setLoadingInitial(false)
    }
  }, [mode, recordId, reset])

  useEffect(() => {
    if (open) fetchData()
  }, [open, fetchData])

  // === Submit ===
  const onSubmit = useCallback(
    async (values: FormValues) => {
      const parsed = schema.safeParse(values)
      if (!parsed.success) return

      try {
        setSubmitting(true)

        const payload = {
          frequency: parsed.data.frequency,
          window: parsed.data.window,
          showInAlert: parsed.data.showInAlert,
          updateByFunction: parsed.data.updateByFunction,
          orderNo: parsed.data.orderNo,
          ...buildRelation(
            'tblCompTypeCounter',
            'compTypeCounterId',
            parsed.data.compTypeCounter.compTypeCounterId
          ),
          ...buildRelation('tblCompTypeJob', 'compTypeJobId', compTypeJobId),
        }

        let result: TypeTblCompTypeJobCounter

        if (mode === 'create') {
          result = await tblCompTypeJobCounter.create(payload)
        } else {
          result = await tblCompTypeJobCounter.update(recordId!, payload)
        }

        onSuccess(result)
        onClose()
      } finally {
        setSubmitting(false)
      }
    },
    [mode, recordId, compTypeJobId, onSuccess, onClose]
  )

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title={mode === 'create' ? 'Create Job Counter' : 'Edit Job Counter'}
      loadingInitial={loadingInitial}
      submitting={submitting}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Box display='grid' gap={1.5}>
        {/* Counter */}
        <Controller
          name='compTypeCounter'
          control={control}
          render={({ field, fieldState }) => (
            <AsyncSelectField
              label='Counter *'
              value={field.value}
              onChange={field.onChange}
              getOptionLabel={(row: any) => row?.tblCounterType?.name}
              request={() =>
                tblCompTypeCounter.getAll({
                  include: {
                    tblCounterType: true,
                  },
                  filter: {
                    compTypeId: compTypeId,
                  },
                })
              }
              columns={[
                {
                  field: 'tblCounterType.name',
                  headerName: 'Counter Type',
                  flex: 1,
                  valueGetter: (_: any, row: any) => row?.tblCounterType?.name,
                },
              ]}
              getRowId={row => row.compTypeCounterId}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />

        <Controller
          name='frequency'
          control={control}
          render={({ field }) => <NumberField {...field} label='Frequency' />}
        />

        <Controller
          name='window'
          control={control}
          render={({ field }) => <NumberField {...field} label='Window' />}
        />

        <Controller
          name='showInAlert'
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={<Checkbox checked={field.value} {...field} />}
              label='Show In Alert'
            />
          )}
        />

        <Controller
          name='updateByFunction'
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={<Checkbox checked={field.value} {...field} />}
              label='Update By Function'
            />
          )}
        />

        <Controller
          name='orderNo'
          control={control}
          render={({ field }) => <NumberField {...field} label='Order No' />}
        />
      </Box>
    </FormDialog>
  )
}

export default memo(JobCounterUpsert)
