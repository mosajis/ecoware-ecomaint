import TextField from '@mui/material/TextField'

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

export default NumberField
