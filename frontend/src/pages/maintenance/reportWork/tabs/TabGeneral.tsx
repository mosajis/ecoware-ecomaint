import * as z from 'zod'
import Splitter from '@/shared/components/Splitter'
import Editor from '@/shared/components/Editor'
import React, { memo, useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import dayjs from 'dayjs'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AsyncSelectField } from '@/shared/components/AsyncSelectField'
import {
  tblMaintType,
  tblMaintCause,
  tblMaintClass,
  tblCounterType,
  TypeTblCounterType,
} from '@/core/api/generated/api'

const selectSchema = <T extends z.ZodRawShape>(shape: T) =>
  z.object(shape).nullable()

const schema = z.object({
  dateDone: z.string().nullable(),
  totalDuration: z.number().nullable(),
  waitingMin: z.number().nullable(),
  unexpected: z.boolean(),

  runningNew: z.number().nullable(),
  runningLastValue: z.number().nullable(),
  runningLastDateRead: z.string().nullable(),

  maintType: selectSchema({
    maintTypeId: z.number(),
    descr: z.string(),
  }),

  maintCause: selectSchema({
    maintCauseId: z.number(),
    descr: z.string(),
  }),

  maintClass: selectSchema({
    maintClassId: z.number(),
    descr: z.string(),
  }),
})

export type TabGeneralValues = z.infer<typeof schema>

const defaultValues: TabGeneralValues = {
  dateDone: dayjs().format('YYYY-MM-DD'),
  totalDuration: null,
  waitingMin: null,
  unexpected: false,

  runningNew: null,
  runningLastValue: null,
  runningLastDateRead: null,

  maintType: null,
  maintCause: null,
  maintClass: null,
}
const NumberField = ({
  label,
  field,
  disabled,
}: {
  label: string
  field: any
  disabled?: boolean
}) => (
  <TextField
    label={label}
    type='number'
    fullWidth
    size='small'
    value={field.value ?? ''}
    onChange={e =>
      field.onChange(e.target.value === '' ? null : Number(e.target.value))
    }
    disabled={disabled}
  />
)

const DateField = ({
  label,
  field,
  disabled,
}: {
  label: string
  field: any
  disabled?: boolean
}) => (
  <TextField
    label={label}
    type='date'
    fullWidth
    value={field.value ?? ''}
    size='small'
    onChange={e => field.onChange(e.target.value || null)}
    InputLabelProps={{ shrink: true }}
    disabled={disabled}
  />
)

const TabGeneral: React.FC = () => {
  const [loadingInitial, setLoadingInitial] = useState(false)
  const [counterTypes, setCounterTypes] = useState<TypeTblCounterType[]>([])

  const {
    control,
    formState: { isSubmitting },
  } = useForm<TabGeneralValues>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  const isDisabled = loadingInitial || isSubmitting
  const hasCounterType = counterTypes.length > 0

  return (
    <Splitter horizontal>
      <Splitter initialPrimarySize='30%'>
        <Box display={'flex'} flexDirection={'column'} gap={1.5} pt={1}>
          <Controller
            name='dateDone'
            control={control}
            render={({ field }) => (
              <DateField
                label='Date Done'
                field={field}
                disabled={isDisabled}
              />
            )}
          />

          <Box display={'flex'} gap={1}>
            <Controller
              name='totalDuration'
              control={control}
              render={({ field }) => (
                <NumberField
                  label='Total Duration (min)'
                  field={field}
                  disabled={isDisabled}
                />
              )}
            />

            {/* Waiting */}
            <Controller
              name='waitingMin'
              control={control}
              render={({ field }) => (
                <NumberField
                  label='Waiting (min)'
                  field={field}
                  disabled={isDisabled}
                />
              )}
            />
          </Box>

          {/* Running Hours */}
          <Box display={'flex'} gap={1}>
            <Controller
              name='runningNew'
              control={control}
              render={({ field }) => (
                <NumberField
                  label='New Value'
                  field={field}
                  disabled={isDisabled || !hasCounterType}
                />
              )}
            />

            <Controller
              name='runningLastValue'
              control={control}
              render={({ field }) => (
                <NumberField
                  label='Last Value'
                  field={field}
                  disabled={isDisabled || !hasCounterType}
                />
              )}
            />

            <Controller
              name='runningLastDateRead'
              control={control}
              render={({ field }) => (
                <NumberField
                  label='Last Date Read'
                  field={field}
                  disabled={isDisabled || !hasCounterType}
                />
              )}
            />
          </Box>

          {/* Maint Type */}
          <Controller
            name='maintType'
            control={control}
            render={({ field }) => (
              <AsyncSelectField
                label='Maint Type'
                value={field.value}
                request={tblMaintType.getAll}
                columns={[
                  { field: 'descr', headerName: 'Description', flex: 1 },
                ]}
                getRowId={row => row.maintTypeId}
                onChange={field.onChange}
              />
            )}
          />

          {/* Maint Cause */}
          <Controller
            name='maintCause'
            control={control}
            render={({ field }) => (
              <AsyncSelectField
                label='Maint Cause'
                value={field.value}
                request={tblMaintCause.getAll}
                columns={[
                  { field: 'descr', headerName: 'Description', flex: 1 },
                ]}
                getRowId={row => row.maintCauseId}
                onChange={field.onChange}
              />
            )}
          />

          {/* Maint Class */}
          <Controller
            name='maintClass'
            control={control}
            render={({ field }) => (
              <AsyncSelectField
                label='Maint Class'
                value={field.value}
                request={tblMaintClass.getAll}
                columns={[
                  { field: 'descr', headerName: 'Description', flex: 1 },
                ]}
                getRowId={row => row.maintClassId}
                onChange={field.onChange}
              />
            )}
          />
          {/* Unexpected */}
          <Controller
            name='unexpected'
            control={control}
            render={({ field }) => (
              <FormControlLabel
                style={{
                  margin: 0,
                }}
                label='Unexpected'
                control={
                  <Checkbox
                    size='small'
                    checked={field.value}
                    onChange={e => field.onChange(e.target.checked)}
                    disabled={isDisabled}
                  />
                }
              />
            )}
          />
        </Box>
        <Editor />
      </Splitter>
      <Splitter>
        <Editor />
        <Editor />
      </Splitter>
    </Splitter>
  )
}

export default memo(TabGeneral)
