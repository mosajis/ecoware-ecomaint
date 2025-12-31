import * as z from 'zod'
import FormDialog from '@/shared/components/formDialog/FormDialog'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import { memo, useEffect, useState, useCallback, useMemo } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AsyncSelectField } from '@/shared/components/AsyncSelectField'
import { BorderedBox } from '@/shared/components/BorderedBox'
import { buildRelation } from '@/core/api/helper'
import {
  tblComponentUnit,
  tblCompType,
  tblLocation,
  tblCompStatus,
  TypeTblComponentUnit,
  tblAddress,
} from '@/core/api/generated/api'

// ========= Schema =========
const schema = z.object({
  compType: z
    .object({
      compTypeId: z.number(),
      compName: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),

  location: z
    .object({
      locationId: z.number(),
      name: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),

  parentComp: z
    .object({
      compId: z.number(),
      compNo: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),

  vendor: z
    .object({
      vendorId: z.number(),
      name: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),

  status: z
    .object({
      compStatusId: z.number(),
      compStatusName: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),

  compNo: z.string().min(1, 'Component No is required'),
  serialNo: z.string().nullable().optional(),
  isCritical: z.boolean().nullable().optional(),
  orderNo: z.number().nullable().optional(),
})

export type ComponentUnitFormValues = z.infer<typeof schema>

type Props = {
  open: boolean
  mode: 'create' | 'update'
  recordId?: number | null
  onClose: () => void
  onSuccess: (data: TypeTblComponentUnit) => void
}

const DEFAULT_VALUES: ComponentUnitFormValues = {
  compType: null,
  location: null,
  parentComp: null,
  vendor: null,
  status: null,
  compNo: '',
  serialNo: null,
  isCritical: false,
  orderNo: null,
}

function ComponentUnitUpsert({
  open,
  mode,
  recordId,
  onClose,
  onSuccess,
}: Props) {
  const [loadingInitial, setLoadingInitial] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const { control, handleSubmit, reset } = useForm<ComponentUnitFormValues>({
    resolver: zodResolver(schema),
    defaultValues: DEFAULT_VALUES,
  })

  // ===== Load data in edit mode =====
  const fetchData = useCallback(async () => {
    if (mode !== 'update' || !recordId) {
      reset(DEFAULT_VALUES)
      return
    }

    setLoadingInitial(true)
    try {
      const res = await tblComponentUnit.getById(recordId, {
        include: {
          tblCompType: true,
          tblLocation: true,
          tblCompStatus: true,
          tblAddress: true,
        },
      })

      reset({
        compType: res?.tblCompType
          ? {
              compTypeId: res.tblCompType.compTypeId,
              compName: res.tblCompType.compName,
            }
          : null,
        location: res?.tblLocation
          ? {
              locationId: res.tblLocation.locationId,
              name: res.tblLocation.name,
            }
          : null,
        status: res?.tblCompStatus
          ? {
              compStatusId: res.tblCompStatus.compStatusId,
              compStatusName: res.tblCompStatus.compStatusName,
            }
          : null,
        compNo: res?.compNo ?? '',
        serialNo: res?.serialNo ?? null,
        isCritical: !!res?.isCritical,
        orderNo: res?.orderNo ?? null,
      })
    } finally {
      setLoadingInitial(false)
    }
  }, [mode, recordId, reset])

  useEffect(() => {
    if (open) fetchData()
  }, [open, fetchData])

  const isDisabled = loadingInitial || submitting

  // ========= Submit Handler =========
  const handleFormSubmit = useCallback(
    async (values: ComponentUnitFormValues) => {
      const parsed = schema.safeParse(values)
      if (!parsed.success) return

      const v = parsed.data

      try {
        setSubmitting(true)

        const body = {
          compNo: v.compNo,
          serialNo: v.serialNo ?? null,
          isCritical: v.isCritical ? 1 : 0,
          orderNo: v.orderNo ?? null,
          ...buildRelation('tblCompType', 'compTypeId', v.compType?.compTypeId),
          ...buildRelation('tblLocation', 'locationId', v.location?.locationId),
          ...buildRelation(
            'tblCompStatus',
            'compStatusId',
            v.status?.compStatusId
          ),
          ...buildRelation('tblVendor', 'vendorId', v.vendor?.vendorId),
        }

        let result: TypeTblComponentUnit

        if (mode === 'create') {
          result = await tblComponentUnit.create(body)
        } else {
          result = await tblComponentUnit.update(recordId!, body)
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
      maxWidth='md'
      open={open}
      onClose={onClose}
      title={mode === 'create' ? 'New Component Unit' : 'Edit Component Unit'}
      submitting={submitting}
      loadingInitial={loadingInitial}
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <Box display='flex' flexDirection='column' gap={1.5}>
        {/* Component No */}
        <Controller
          name='compNo'
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label='Component No'
              size='small'
              fullWidth
              disabled={isDisabled}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />

        {/* Component Type */}
        <Controller
          name='compType'
          control={control}
          render={({ field }) => (
            <Box width='60%'>
              <AsyncSelectField
                dialogMaxWidth='sm'
                label='Component Type'
                getOptionLabel={row => row.compName}
                value={field.value}
                selectionMode='single'
                request={tblCompType.getAll}
                columns={[
                  { field: 'compName', headerName: 'Name', flex: 1 },
                  { field: 'compTypeNo', headerName: 'Type No', flex: 1 },
                ]}
                getRowId={row => row.compTypeId}
                onChange={field.onChange}
              />
            </Box>
          )}
        />

        {/* Location */}
        <Controller
          name='location'
          control={control}
          render={({ field }) => (
            <Box width='60%'>
              <AsyncSelectField
                dialogMaxWidth='sm'
                label='Location'
                getOptionLabel={row => row.name}
                value={field.value}
                selectionMode='single'
                request={tblLocation.getAll}
                columns={[
                  { field: 'name', headerName: 'Name', flex: 1 },
                  { field: 'locationCode', headerName: 'Code', flex: 1 },
                ]}
                getRowId={row => row.locationId}
                onChange={field.onChange}
              />
            </Box>
          )}
        />

        {/* Status */}
        <Controller
          name='status'
          control={control}
          render={({ field }) => (
            <Box width='60%'>
              <AsyncSelectField
                dialogMaxWidth='sm'
                label='Status'
                getOptionLabel={row => row.compStatusName}
                value={field.value}
                selectionMode='single'
                request={tblCompStatus.getAll}
                columns={[
                  { field: 'compStatusName', headerName: 'Status', flex: 1 },
                ]}
                getRowId={row => row.compStatusId}
                onChange={field.onChange}
              />
            </Box>
          )}
        />

        {/* Serial No */}
        <Controller
          name='serialNo'
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label='Serial No'
              size='small'
              fullWidth
              disabled={isDisabled}
              value={field.value ?? ''}
            />
          )}
        />

        {/* Vendor
        <Controller
          name='vendor'
          control={control}
          render={({ field }) => (
            <Box width='60%'>
              <AsyncSelectField
                dialogMaxWidth='sm'
                label='Vendor'
                getOptionLabel={row => row.}
                value={field.value}
                selectionMode='single'
                request={tblAddress.getAll}
                columns={[
                  { field: 'name', headerName: 'Vendor Name', flex: 1 },
                ]}
                getRowId={row => row.vendorId}
                onChange={field.onChange}
              />
            </Box>
          )}
        /> */}

        {/* Order No */}
        <Controller
          name='orderNo'
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              type='number'
              label='Order No'
              fullWidth
              size='small'
              disabled={isDisabled}
              value={field.value ?? ''}
              onChange={e =>
                field.onChange(
                  e.target.value === '' ? null : Number(e.target.value)
                )
              }
            />
          )}
        />
      </Box>

      {/* Bottom Section - Advanced Options */}
      <BorderedBox label='Advanced Options' mt={2}>
        <Controller
          name='isCritical'
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={<Checkbox {...field} checked={!!field.value} />}
              label='Is Critical'
            />
          )}
        />
      </BorderedBox>
    </FormDialog>
  )
}

export default memo(ComponentUnitUpsert)
