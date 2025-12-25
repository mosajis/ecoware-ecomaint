import Editor from '@/shared/components/Editor'
import ReportWorkStep from '../../ReportWorkStep'
import DateField from '@/shared/components/DateField'
import NumberField from '@/shared/components/NumberField'
import Box from '@mui/material/Box'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAtom } from 'jotai'
import { buildRelation } from '@/core/api/helper'
import { AsyncSelectField } from '@/shared/components/AsyncSelectField'
import { schema, TypeValues } from './stepGeneralSchema'
import {
  tblMaintType,
  tblMaintCause,
  tblMaintClass,
  tblMaintLog,
} from '@/core/api/generated/api'
import { atomInitalData } from '../../ReportWorkAtom'

const TabGeneral = () => {
  const [initalData, setInitalData] = useAtom(atomInitalData)

  const defaultValues: TypeValues = {
    dateDone:
      new Date(initalData.maintLog?.dateDone || '').toString() ||
      new Date().toISOString(),
    totalDuration: initalData.maintLog?.totalDuration || null,
    waitingMin: initalData.maintLog?.downTime || null,
    unexpected: initalData.maintLog?.unexpected === 1 || false,

    maintType: initalData.maintLog?.tblMaintType ?? null,
    maintCause: initalData.maintLog?.tblMaintCause ?? null,
    maintClass: initalData.maintLog?.tblMaintClass ?? null,

    history: initalData.maintLog?.history || '',
  }

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<TypeValues>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  const isDisabled = isSubmitting

  const onSubmit = async (values: TypeValues) => {
    const payload = {
      totalDuration: values.totalDuration ?? 0,
      downTime: values.waitingMin ?? 0,
      dateDone: values.dateDone ? new Date(values.dateDone).getTime() : null,
      unexpected: values.unexpected ? 1 : 0,
      history: values.history || '',

      ...buildRelation(
        'tblMaintType',
        'maintTypeId',
        values.maintType?.maintTypeId
      ),
      ...buildRelation(
        'tblMaintCause',
        'maintCauseId',
        values.maintCause?.maintCauseId
      ),
      ...buildRelation(
        'tblMaintClass',
        'maintClassId',
        values.maintClass?.maintClassId
      ),
    }

    let savedRecord

    if (initalData.maintLog?.maintLogId) {
      // اگر رکورد قبلاً وجود داشته، آپدیت کن
      savedRecord = await tblMaintLog.update(
        initalData.maintLog.maintLogId,
        payload
      )
    } else {
      // اگر وجود نداشت، ایجاد کن
      savedRecord = await tblMaintLog.create(payload)
    }

    setInitalData(prev => ({
      ...prev,
      maintLog: savedRecord,
    }))

    return savedRecord
  }

  const handleNext = (goNext: () => void) => {
    handleSubmit(async values => {
      await onSubmit(values)
      goNext()
    })()
  }

  return (
    <ReportWorkStep onNext={handleNext}>
      <Box display={'grid'} gap={1.5} gridTemplateColumns={'1fr 1fr 1fr'}>
        <Controller
          name='dateDone'
          control={control}
          render={({ field }) => (
            <DateField type='DATETIME' label='Date Done' field={field} />
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
        {/* <Controller
          name='runningNew'
          control={control}
          render={({ field }) => <NumberField label='Current Value' field={field} disabled={isDisabled} />}
        />
        <Controller
          name='runningLastValue'
          control={control}
          render={({ field }) => <NumberField label='Last Value' field={field} disabled={isDisabled} />}
        />
        <Controller
          name='runningLastDateRead'
          control={control}
          render={({ field }) => <NumberField label='Last Date Read' field={field} />}
        /> */}
        <Controller
          name='maintType'
          control={control}
          render={({ field }) => (
            <AsyncSelectField
              label='Maint Type'
              value={field.value}
              request={tblMaintType.getAll}
              columns={[{ field: 'descr', headerName: 'Description', flex: 1 }]}
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
              columns={[{ field: 'descr', headerName: 'Description', flex: 1 }]}
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
              columns={[{ field: 'descr', headerName: 'Description', flex: 1 }]}
              getRowId={row => row.maintClassId}
              onChange={field.onChange}
            />
          )}
        />
      </Box>
      {/* -------- Editors -------- */}
      <Box display='flex' gap={1} flex={1}>
        <Controller
          name='history'
          control={control}
          render={({ field }) => (
            <Editor
              label='History'
              initValue={JSON.stringify(initalData)}
              {...field}
            />
          )}
        />
        <Editor
          label='Job Description'
          initValue={initalData.workOrder?.compJobId?.toString() || '--'}
          readOnly
        />
      </Box>
    </ReportWorkStep>
  )
}

export default TabGeneral
