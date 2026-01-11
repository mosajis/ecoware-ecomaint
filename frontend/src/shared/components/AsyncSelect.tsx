import debounce from 'lodash-es/debounce'
import { useState, useCallback, useRef, useEffect, ReactNode } from 'react'
import { Controller, Control } from 'react-hook-form'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import CircularProgress from '@mui/material/CircularProgress'

export type SelectionMode = 'single' | 'multiple'

export interface AsyncSelectProps<T> {
  name?: string
  control?: Control<any>
  label?: string
  placeholder?: string
  disabled?: boolean
  sx?: any
  selectionMode?: SelectionMode
  value?: any | null
  initialOptions?: T[]
  error?: boolean
  helperText?: ReactNode
  request: () => Promise<any>
  extractRows?: (data: any) => T[]
  getOptionLabel?: (row: T) => string
  onChange?: (value: T | T[] | null) => void
}

export default function AsyncSelect<T>({
  name,
  control,
  label,
  placeholder,
  disabled = false,
  sx,
  selectionMode = 'single',
  value,
  initialOptions = [],
  error,
  helperText,
  request,
  extractRows = (data: any) => data?.items ?? [],
  getOptionLabel = (row: any) => row?.label ?? String(row),
  onChange,
}: AsyncSelectProps<T>) {
  const multiple = selectionMode === 'multiple'

  const [options, setOptions] = useState<T[]>(initialOptions)
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)

  const loadedOnceRef = useRef(false)

  const loadOptions = useCallback(
    debounce(async (query?: string) => {
      setLoading(true)
      try {
        const res = await request()
        const rows = extractRows(res)
        setOptions(rows)
      } finally {
        setLoading(false)
      }
    }, 300),
    [request, extractRows]
  )

  useEffect(() => {
    if (initialOptions.length > 0) {
      setOptions(prev => {
        const map = new Map()
        prev.forEach(o => map.set(o, o))
        initialOptions.forEach(o => map.set(o, o))
        return Array.from(map.values())
      })
    }
  }, [initialOptions])

  const handleOpen = () => {
    if (!loadedOnceRef.current) {
      loadOptions('')
      loadedOnceRef.current = true
    }
  }

  const handleChange = (
    selected: T | T[] | null,
    fieldOnChange?: (value: any) => void
  ) => {
    fieldOnChange?.(selected)
    onChange?.(selected)
  }

  const renderAutocomplete = (field?: any) => (
    <Autocomplete<T, boolean, false, false>
      multiple={multiple}
      options={options}
      value={field?.value ?? value ?? (multiple ? [] : null)}
      getOptionLabel={getOptionLabel || ''}
      isOptionEqualToValue={(option, val) => option === val}
      onChange={(_, v) => handleChange(v, field?.onChange)}
      inputValue={inputValue}
      onInputChange={(_, newInputValue, reason) => {
        setInputValue(newInputValue)
        if (reason === 'input') {
          loadOptions(newInputValue)
        }
      }}
      onOpen={handleOpen}
      loading={loading}
      disabled={disabled}
      renderInput={params => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          size='small'
          error={error}
          helperText={helperText}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading && <CircularProgress size={20} color='inherit' />}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      sx={sx}
    />
  )

  // RHF mode
  if (control && name) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => renderAutocomplete(field)}
      />
    )
  }

  // Controlled mode
  return renderAutocomplete()
}
