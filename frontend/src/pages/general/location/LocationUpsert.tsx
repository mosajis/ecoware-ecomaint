import * as z from 'zod'
import FormDialog from '@/shared/components/formDialog/FormDialog'
import { memo, useEffect, useState, useCallback } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { tblLocation, TypeTblLocation } from '@/core/api/generated/api'
import { AsyncSelectDialog } from '@/shared/components/AsyncSelectDialog'
import { AsyncSelectField } from '@/shared/components/AsyncSelectField'
import { buildRelation, requiredStringField } from '@/core/api/helper'
import NumberField from '@/shared/components/NumberField'

// === Validation Schema ===
const schema = z.object({
  name: requiredStringField(),
  locationCode: requiredStringField(),
  orderNo: z.number().nullable(),
  parentLocationId: z
    .object({
      locationId: z.number(),
      name: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
})

export type LocationFormValues = z.infer<typeof schema>

type Props = {
  open: boolean
  mode: 'create' | 'update'
  recordId?: number | null
  onClose: () => void
  onSuccess: (data: TypeTblLocation) => void
}

function LocationUpsert({ open, mode, recordId, onClose, onSuccess }: Props) {
  const [loadingInitial, setLoadingInitial] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [parentLocation, setParentLocation] = useState<TypeTblLocation | null>(
    null
  )

  const defaultValues: LocationFormValues = {
    name: '',
    locationCode: '',
    parentLocationId: null,
    orderNo: null,
  }

  const { control, handleSubmit, reset, watch } = useForm<LocationFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  // === Load record in edit mode ===
  const fetchData = useCallback(async () => {
    if (mode !== 'update' || !recordId) {
      reset(defaultValues)
      setParentLocation(null)
      return
    }

    setLoadingInitial(true)

    try {
      const res = await tblLocation.getById(recordId, {
        include: { tblLocation: true },
      })

      reset({
        name: res?.name ?? '',
        locationCode: res?.locationCode ?? '',
        parentLocationId: res?.tblLocation ?? null,
        orderNo: res?.orderNo ?? null,
      })

      // نمایش parent
      if (res?.tblLocation) {
        setParentLocation(res.tblLocation)
      } else {
        setParentLocation(null)
      }
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
    async (values: LocationFormValues) => {
      const parsed = schema.safeParse(values)
      if (!parsed.success) return

      try {
        setSubmitting(true)

        let result: TypeTblLocation

        const parentId = parsed.data.parentLocationId
          ? parsed.data.parentLocationId.locationId
          : null

        const parentRelation = buildRelation(
          'tblLocation',
          'locationId',
          parentId
        )

        if (mode === 'create') {
          result = await tblLocation.create({
            orderNo: parsed.data.orderNo,
            name: parsed.data.name,
            locationCode: parsed.data.locationCode,
            ...parentRelation,
          })
        } else {
          result = await tblLocation.update(recordId!, {
            orderNo: parsed.data.orderNo,
            name: parsed.data.name,
            locationCode: parsed.data.locationCode,
            ...parentRelation,
          })
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
      title={mode === 'create' ? 'Create Location' : 'Edit Location'}
      submitting={submitting}
      loadingInitial={loadingInitial}
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <Box display='grid' gridTemplateColumns='repeat(1, 1fr)' gap={1.5}>
        {/* Code */}
        <Controller
          name='locationCode'
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              sx={{ width: '75%' }}
              {...field}
              label='Code *'
              size='small'
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              disabled={isDisabled}
            />
          )}
        />

        {/* Name */}
        <Controller
          name='name'
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label='Name *'
              size='small'
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              disabled={isDisabled}
            />
          )}
        />

        {/* Parent Location */}
        <Controller
          name='parentLocationId'
          control={control}
          render={({ field, fieldState }) => (
            <AsyncSelectField
              dialogMaxWidth='sm'
              label='Parent Location'
              selectionMode='single'
              value={field.value}
              request={tblLocation.getAll}
              columns={[{ field: 'name', headerName: 'Name', flex: 1 }]}
              getRowId={row => row.locationId}
              onChange={field.onChange}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />

        {/* Order */}
        <Controller
          name='orderNo'
          control={control}
          render={({ field }) => (
            <NumberField
              {...field}
              label='Order No'
              sx={{ width: '50%' }}
              size='small'
              disabled={isDisabled}
            />
          )}
        />
      </Box>
    </FormDialog>
  )
}

export default memo(LocationUpsert)
