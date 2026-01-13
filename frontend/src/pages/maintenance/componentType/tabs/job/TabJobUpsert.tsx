import * as z from 'zod'
import FormDialog from '@/shared/components/formDialog/FormDialog'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import RadioGroup from '@mui/material/RadioGroup'
import Radio from '@mui/material/Radio'
import { memo, useEffect, useState, useCallback, useMemo } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AsyncSelectField } from '@/shared/components/AsyncSelectField'
import { BorderedBox } from '@/shared/components/BorderedBox'
import { buildRelation } from '@/core/api/helper'
import {
  tblCompTypeJob,
  tblJobDescription,
  tblDiscipline,
  tblMaintClass,
  tblMaintCause,
  tblMaintType,
  TypeTblCompTypeJob,
  tblPeriod,
} from '@/core/api/generated/api'

// ========= Schema =========
const schema = z.object({
  compType: z
    .object({
      compTypeId: z.number(),
      compName: z.string(),
    })
    .nullable()
    .optional(),

  jobDesc: z
    .object({
      jobDescId: z.number(),
      jobDescTitle: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),

  disc: z
    .object({
      discId: z.number(),
      descr: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),

  maintClass: z
    .object({
      maintClassId: z.number(),
      descr: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),

  maintCause: z
    .object({
      maintCauseId: z.number(),
      descr: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),

  maintType: z
    .object({
      maintTypeId: z.number(),
      descr: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),

  frequency: z.number().nullable().optional(),
  frequencyPeriod: z
    .object({
      periodId: z.number(),
      name: z.string(),
    })
    .nullable()
    .optional(),

  priority: z.number().nullable().optional(),
  window: z.number().nullable().optional(),

  statusNone: z.boolean().nullable().optional(),
  statusAvailable: z.boolean().nullable().optional(),
  statusInUse: z.boolean().nullable().optional(),
  statusRepair: z.boolean().nullable().optional(),

  planningMethod: z.string().nullable().optional(),

  active: z.boolean().nullable().optional(),
  mandatoryHistory: z.boolean().nullable().optional(),
})

type JobFormValues = z.infer<typeof schema>

type Props = {
  open: boolean
  mode: 'create' | 'update'
  recordId?: number | null
  onClose: () => void
  onSuccess: (data: TypeTblCompTypeJob) => void
  compType?: {
    compTypeId: number
    compName: string
  }
}

const DEFAULT_VALUES: JobFormValues = {
  compType: null,
  jobDesc: null,
  disc: null,
  maintClass: null,
  maintCause: null,
  maintType: null,
  frequency: null,
  frequencyPeriod: null,
  priority: null,
  window: null,
  statusNone: true,
  statusAvailable: true,
  statusInUse: true,
  statusRepair: true,
  planningMethod: 'Variable',
  active: true,
  mandatoryHistory: false,
}

function ComponentTypeJobUpsert({
  open,
  mode,
  recordId,
  onClose,
  onSuccess,
  compType,
}: Props) {
  const [loadingInitial, setLoadingInitial] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const defaultValues = useMemo(
    () => ({ ...DEFAULT_VALUES, compType: compType ?? null }),
    [compType]
  )

  const { control, handleSubmit, reset } = useForm<JobFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  // ===== Load data in edit mode =====
  const fetchData = useCallback(async () => {
    if (mode !== 'update' || !recordId) {
      reset(defaultValues)
      return
    }

    setLoadingInitial(true)
    try {
      const res = await tblCompTypeJob.getById(recordId, {
        include: {
          tblJobDescription: true,
          tblDiscipline: true,
          tblMaintClass: true,
          tblMaintCause: true,
          tblMaintType: true,
          tblPeriod: true,
        },
      })

      reset({
        jobDesc: res?.tblJobDescription ?? null,
        disc: res?.tblDiscipline ?? null,
        maintClass: res?.tblMaintClass ?? null,
        maintCause: res?.tblMaintCause ?? null,
        maintType: res?.tblMaintType ?? null,
        frequency: res?.frequency ?? null,
        frequencyPeriod: res?.tblPeriod ?? null,
        priority: res?.priority ?? null,
        window: res?.window ?? null,
        statusNone: !!res?.statusNone,
        statusAvailable: !!res?.statusAvailable,
        statusInUse: !!res?.statusInUse,
        statusRepair: !!res?.statusRepair,
        planningMethod: res?.planningMethod === 1 ? 'Fixed' : 'Variable',
      })
    } finally {
      setLoadingInitial(false)
    }
  }, [mode, recordId, reset, defaultValues])

  useEffect(() => {
    if (open) fetchData()
  }, [open, fetchData])

  const isDisabled = loadingInitial || submitting

  // ========= Submit Handler =========
  const handleFormSubmit = useCallback(
    async (values: JobFormValues) => {
      const parsed = schema.safeParse(values)
      if (!parsed.success) return

      const v = parsed.data

      try {
        setSubmitting(true)

        const body = {
          frequency: v.frequency ?? null,
          priority: v.priority ?? null,
          window: v.window ?? null,
          planningMethod: v.planningMethod === 'Fixed' ? 1 : 0,
          statusNone: v.statusNone ? 1 : 0,
          statusAvailable: v.statusAvailable ? 1 : 0,
          statusInUse: v.statusInUse ? 1 : 0,
          statusRepair: v.statusRepair ? 1 : 0,
          ...buildRelation('tblCompType', 'compTypeId', compType?.compTypeId),
          ...buildRelation(
            'tblPeriod',
            'periodId',
            v.frequencyPeriod?.periodId
          ),
          ...buildRelation(
            'tblJobDescription',
            'jobDescId',
            v.jobDesc?.jobDescId
          ),
          ...buildRelation('tblDiscipline', 'discId', v.disc?.discId),
          ...buildRelation(
            'tblMaintClass',
            'maintClassId',
            v.maintClass?.maintClassId
          ),
          ...buildRelation(
            'tblMaintCause',
            'maintCauseId',
            v.maintCause?.maintCauseId
          ),
          ...buildRelation(
            'tblMaintType',
            'maintTypeId',
            v.maintType?.maintTypeId
          ),
          active: v.active ? 1 : 0,
          mandatoryHistory: v.mandatoryHistory ? 1 : 0,
        }

        let result: TypeTblCompTypeJob

        if (mode === 'create') {
          result = await tblCompTypeJob.create(body)
        } else {
          result = await tblCompTypeJob.update(recordId!, body)
        }

        onSuccess(result)
        onClose()
      } finally {
        setSubmitting(false)
      }
    },
    [mode, recordId, compType?.compTypeId, onSuccess, onClose]
  )

  return (
    <FormDialog
      maxWidth='md'
      open={open}
      onClose={onClose}
      title={mode === 'create' ? 'CompType Job' : 'Edit CompType Job'}
      submitting={submitting}
      loadingInitial={loadingInitial}
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <Box display='flex' flexDirection='column' gap={2}>
        {/* Component Type */}
        <TextField
          label='Component Type'
          value={compType?.compName ?? ''}
          size='small'
          fullWidth
          slotProps={{ input: { readOnly: isDisabled } }}
        />

        {/* Job Description */}
        <Controller
          name='jobDesc'
          control={control}
          render={({ field }) => (
            <Box width='60%'>
              <AsyncSelectField
                dialogMaxWidth='sm'
                label='Job Description'
                getOptionLabel={row => row.jobDescTitle}
                value={field.value}
                selectionMode='single'
                request={tblJobDescription.getAll}
                columns={[
                  { field: 'jobDescTitle', headerName: 'Title', flex: 1 },
                ]}
                getRowId={row => row.jobDescId}
                onChange={field.onChange}
              />
            </Box>
          )}
        />

        {/* Discipline */}
        <Controller
          name='disc'
          control={control}
          render={({ field }) => (
            <Box width='45%'>
              <AsyncSelectField
                dialogMaxWidth='sm'
                label='Discipline'
                value={field.value}
                selectionMode='single'
                request={tblDiscipline.getAll}
                columns={[{ field: 'name', headerName: 'Discipline', flex: 1 }]}
                getRowId={row => row.discId}
                onChange={field.onChange}
              />
            </Box>
          )}
        />

        {/* Frequency & Period */}
        <Box display='flex' gap={1.5} width='66%'>
          <Controller
            name='frequency'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type='number'
                label='Frequency'
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
          <Controller
            name='frequencyPeriod'
            control={control}
            render={({ field, fieldState }) => (
              <AsyncSelectField
                dialogMaxWidth='sm'
                label='Frequency Period'
                value={field.value}
                selectionMode='single'
                request={tblPeriod.getAll}
                columns={[{ field: 'name', headerName: 'Name', flex: 1 }]}
                getOptionLabel={row => row.name}
                error={!!fieldState.error}
                getRowId={row => row.periodId}
                onChange={field.onChange}
              />
            )}
          />
        </Box>

        {/* Maintenance Fields */}
        <Box display='flex' gap={1.5}>
          <Controller
            name='maintClass'
            control={control}
            render={({ field }) => (
              <AsyncSelectField
                dialogMaxWidth='sm'
                label='Maint Class'
                value={field.value}
                selectionMode='single'
                request={tblMaintClass.getAll}
                columns={[
                  { field: 'descr', headerName: 'Maint Class', flex: 1 },
                ]}
                getRowId={row => row.maintClassId}
                onChange={field.onChange}
              />
            )}
          />
          <Controller
            name='maintCause'
            control={control}
            render={({ field }) => (
              <AsyncSelectField
                dialogMaxWidth='sm'
                label='Maint Cause'
                value={field.value}
                selectionMode='single'
                request={tblMaintCause.getAll}
                columns={[
                  { field: 'descr', headerName: 'Maint Cause', flex: 1 },
                ]}
                getRowId={row => row.maintCauseId}
                onChange={field.onChange}
              />
            )}
          />
          <Controller
            name='maintType'
            control={control}
            render={({ field }) => (
              <AsyncSelectField
                dialogMaxWidth='sm'
                label='Maint Type'
                value={field.value}
                selectionMode='single'
                request={tblMaintType.getAll}
                columns={[
                  { field: 'descr', headerName: 'Maint Type', flex: 1 },
                ]}
                getRowId={row => row.maintTypeId}
                onChange={field.onChange}
              />
            )}
          />
        </Box>

        {/* Priority & Window */}
        <Box display='flex' width='66%' gap={1.5}>
          <Controller
            name='priority'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type='number'
                label='Priority'
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
          <Controller
            name='window'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type='number'
                label='Window'
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
      </Box>

      {/* Status Checkboxes */}
      <BorderedBox label='Component Status' mt={2} width='80%'>
        <Box display='flex' gap={2}>
          <Controller
            name='statusNone'
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Checkbox {...field} checked={!!field.value} />}
                label='None'
              />
            )}
          />
          <Controller
            name='statusAvailable'
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Checkbox {...field} checked={!!field.value} />}
                label='Available'
              />
            )}
          />
          <Controller
            name='statusInUse'
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Checkbox {...field} checked={!!field.value} />}
                label='In Use'
              />
            )}
          />
          <Controller
            name='statusRepair'
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Checkbox {...field} checked={!!field.value} />}
                label='Repair'
              />
            )}
          />
        </Box>
      </BorderedBox>

      {/* Bottom Section */}
      <Box display='flex' gap={1.5} width='100%'>
        {/* Planning Method */}
        <BorderedBox label='Planning Method' mt={2}>
          <Controller
            name='planningMethod'
            control={control}
            render={({ field }) => (
              <RadioGroup {...field} row>
                <FormControlLabel
                  value='Variable'
                  control={<Radio />}
                  label='Variable'
                />
                <FormControlLabel
                  value='Fixed'
                  control={<Radio />}
                  label='Fixed'
                />
              </RadioGroup>
            )}
          />
        </BorderedBox>

        {/* Advanced Options */}
        <BorderedBox label='Advanced Option' mt={2} direction='row'>
          <Box>
            <Controller
              name='active'
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} checked={!!field.value} />}
                  label='Active'
                />
              )}
            />
            <Controller
              name='mandatoryHistory'
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} checked={!!field.value} />}
                  label='Mandatory History'
                />
              )}
            />
          </Box>
        </BorderedBox>
      </Box>
    </FormDialog>
  )
}

export default memo(ComponentTypeJobUpsert)
