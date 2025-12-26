import * as z from 'zod'
import FormDialog from '@/shared/components/formDialog/FormDialog'
import { memo, useEffect, useState, useCallback } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { tblEmployee, TypeTblEmployee } from '@/core/api/generated/api'
import { AsyncSelectField } from '@/shared/components/AsyncSelectField'
import NumberField from '@/shared/components/NumberField'

// === Validation Schema ===
const schema = z.object({
  employee: z
    .object({
      employeeId: z.number(),
      firstName: z.string().nullable().optional(),
      lastName: z.string().nullable().optional(),
      tblDiscipline: z
        .object({
          discId: z.number(),
          name: z.string().nullable().optional(),
        })
        .nullable()
        .optional(),
    })
    .nullable(),
  discipline: z.string().nullable().optional(),
  timeSpent: z.number().min(0, 'Time spent must be greater than 0'),
})

export type StepResourceUsedFormValues = z.infer<typeof schema>

type Props = {
  open: boolean
  mode: 'create' | 'update'
  recordId?: number | null
  onClose: () => void
  onSuccess: (data: StepResourceUsedFormValues) => void
}

function StepResourceUsedFormDialog({
  open,
  mode,
  recordId,
  onClose,
  onSuccess,
}: Props) {
  const [loadingInitial, setLoadingInitial] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [selectedEmployee, setSelectedEmployee] =
    useState<TypeTblEmployee | null>(null)

  const defaultValues: StepResourceUsedFormValues = {
    employee: null,
    discipline: null,
    timeSpent: 0,
  }

  const { control, handleSubmit, reset, watch } =
    useForm<StepResourceUsedFormValues>({
      resolver: zodResolver(schema),
      defaultValues,
    })

  const employeeValue = watch('employee')

  // === Load record in edit mode ===
  const fetchData = useCallback(async () => {
    if (mode !== 'update' || !recordId) {
      reset(defaultValues)
      setSelectedEmployee(null)
      return
    }

    setLoadingInitial(true)

    try {
      // در اینجا می‌تونی از API بخونی اگر نیاز باشه
      // فعلا فقط default set می‌کنیم
      reset(defaultValues)
      setSelectedEmployee(null)
    } finally {
      setLoadingInitial(false)
    }
  }, [mode, recordId, reset])

  useEffect(() => {
    if (open) fetchData()
  }, [open, fetchData])

  // === Update discipline display when employee changes ===
  useEffect(() => {
    if (employeeValue?.tblDiscipline) {
      // نمایش نام discipline بر اساس انتخاب شده
    }
  }, [employeeValue])

  const isDisabled = loadingInitial || submitting

  // === Submit Handler ===
  const handleFormSubmit = useCallback(
    async (values: StepResourceUsedFormValues) => {
      const parsed = schema.safeParse(values)
      if (!parsed.success) return

      try {
        setSubmitting(true)

        // ===== API CALL SECTION =====
        // TODO: درخواست را برای ایجاد (POST) یا به‌روزرسانی (PUT) تنظیم کنید
        /*
        if (mode === "create") {
          // POST Request
          const result = await tblStepResourceUsed.create({
            employeeId: parsed.data.employee?.employeeId,
            timeSpent: parsed.data.timeSpent,
            // سایر فیلدها...
          });
        } else {
          // PUT Request
          const result = await tblStepResourceUsed.update(recordId!, {
            employeeId: parsed.data.employee?.employeeId,
            timeSpent: parsed.data.timeSpent,
            // سایر فیلدها...
          });
        }
        */

        // فعلا فقط داده‌ها رو بفرست
        onSuccess(values)
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
      title={
        mode === 'create'
          ? 'Create Step Resource Used'
          : 'Edit Step Resource Used'
      }
      submitting={submitting}
      loadingInitial={loadingInitial}
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <Box display='grid' gridTemplateColumns='repeat(1, 1fr)' gap={1.5}>
        {/* Employee Select - Required */}
        <Controller
          name='employee'
          control={control}
          rules={{
            required: 'Employee is required',
          }}
          render={({ field, fieldState }) => (
            <AsyncSelectField
              dialogMaxWidth='sm'
              label='Employee *'
              selectionMode='single'
              value={field.value}
              request={() =>
                tblEmployee.getAll({
                  include: { tblDiscipline: true },
                })
              }
              columns={[
                {
                  field: 'firstName',
                  headerName: 'First Name',
                  flex: 1,
                },
                {
                  field: 'lastName',
                  headerName: 'Last Name',
                  flex: 1,
                },
              ]}
              getRowId={row => row.employeeId}
              onChange={field.onChange}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              disabled={isDisabled}
            />
          )}
        />

        {/* Discipline Display - Read Only */}
        <Controller
          name='discipline'
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label='Discipline'
              size='small'
              disabled={true}
              value={employeeValue?.tblDiscipline?.name || ''}
            />
          )}
        />

        {/* Time Spent - Required */}
        <Controller
          name='timeSpent'
          control={control}
          rules={{
            required: 'Time spent is required',
          }}
          render={({ field, fieldState }) => (
            <NumberField
              {...field}
              label='Time Spent (Hours) *'
              size='small'
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              disabled={isDisabled}
              value={field.value ?? 0}
              onChange={value => field.onChange(value)}
            />
          )}
        />
      </Box>
    </FormDialog>
  )
}

export default memo(StepResourceUsedFormDialog)
