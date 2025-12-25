import React from 'react'
import { DatePicker, DateTimePicker, TimePicker } from '@mui/x-date-pickers'
import { CalendarToday, AccessTime, Event } from '@mui/icons-material'
import { DATE_FORMATS, DateTimeType } from '@/const'
import { useAtomValue } from 'jotai'
import { atomLanguage } from '../atoms/general.atom'

interface DateFieldProps {
  label: string
  field: any
  disabled?: boolean
  type?: DateTimeType
}

const DateField: React.FC<DateFieldProps> = ({
  label,
  field,
  disabled = false,
  type = 'DATE',
  ...restProps
}) => {
  const language = useAtomValue(atomLanguage)
  const locale = language === 'fa' ? 'FA' : 'EN'

  const dateValue = field.value ? new Date(field.value) : null

  const handleChange = (newValue: Date | null) => {
    field.onChange(newValue ? newValue.toISOString() : null)
  }

  const getDefaultIcon = (): React.ElementType => {
    switch (type) {
      case 'TIME':
        return AccessTime
      case 'DATETIME':
        return Event
      case 'DATE':
      default:
        return CalendarToday
    }
  }

  const Picker =
    type === 'TIME'
      ? TimePicker
      : type === 'DATETIME'
      ? DateTimePicker
      : DatePicker

  const format = DATE_FORMATS[locale][type]

  return (
    <Picker
      {...restProps}
      label={label}
      value={dateValue}
      onChange={handleChange}
      disabled={disabled}
      slots={{ openPickerIcon: getDefaultIcon() }}
      slotProps={{
        textField: {
          fullWidth: true,
          size: 'small',
        },
      }}
      {...((type === 'TIME' || type === 'DATETIME') && { ampm: false })}
      timeSteps={
        type === 'TIME' || type === 'DATETIME' ? { minutes: 1 } : undefined
      }
      format={format}
    />
  )
}

export default DateField
