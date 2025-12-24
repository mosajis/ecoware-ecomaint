import * as z from 'zod'
import Editor from '@/shared/components/Editor'
import ReportWorkStep from '../ReportWorkStep'
import { memo, useState } from 'react'
import { Box, TextField } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AsyncSelectField } from '@/shared/components/AsyncSelectField'
import {
  tblMaintType,
  tblMaintCause,
  tblMaintClass,
  TypeTblCounterType,
} from '@/core/api/generated/api'
import DateField from '@/shared/components/DateField'

/** ----------------------- Schema ----------------------- */
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
  dateDone: new Date().toISOString(),
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

/** ----------------------- Components ----------------------- */
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

/** ----------------------- Main Component ----------------------- */
const TabGeneral = () => {
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
    <ReportWorkStep>
      <Box display='flex' flexDirection='column' gap={1.5} height='100%'>
        <Box display='flex' gap={1}>
          <Box display='flex' flexDirection='column' gap={1.5} flex={1}>
            <Controller
              name='dateDone'
              control={control}
              render={({ field }) => (
                <DateField type='DATE' label='Date Done' field={field} />
              )}
            />
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

          <Box display='flex' flexDirection='column' gap={1.5} flex={1}>
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

          <Box display='flex' flexDirection='column' gap={1.5} flex={1}>
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
          </Box>
        </Box>

        <Box display='flex' gap={1} flex={1}>
          <Editor label='History' />
          <Editor label='Not Set' />
        </Box>
      </Box>
    </ReportWorkStep>
  )
}

export default TabGeneral
