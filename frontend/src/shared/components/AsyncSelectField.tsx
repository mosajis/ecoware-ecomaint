import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import TextField from '@mui/material/TextField'
import { JSX, useState } from 'react'
import { AsyncSelectDialog } from './AsyncSelectDialog'
import type { GridRowId } from '@mui/x-data-grid'

// ---------------- Base Props ----------------
type BaseAsyncSelectFieldProps<TItem extends Record<string, any>> = {
  label?: string
  placeholder?: string
  disabled?: boolean
  columns: any[]
  error?: boolean
  helperText?: string

  request: () => Promise<any>
  extractRows?: (data: any) => TItem[]

  getRowId: (row: TItem) => GridRowId
  getOptionLabel?: (item: TItem) => string | null | undefined

  dialogHeight?: number | string
  dialogMaxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false
}

// ---------------- Single / Multiple Props ----------------
type AsyncSelectSingleProps<TItem extends Record<string, any>> =
  BaseAsyncSelectFieldProps<TItem> & {
    selectionMode?: 'single'
    value?: any | null
    onChange: (value: TItem | null) => void
  }

type AsyncSelectMultipleProps<TItem extends Record<string, any>> =
  BaseAsyncSelectFieldProps<TItem> & {
    selectionMode: 'multiple'
    value?: any[] | null
    onChange: (value: TItem[] | null) => void
  }

export type AsyncSelectFieldProps<TItem extends Record<string, any>> =
  | AsyncSelectSingleProps<TItem>
  | AsyncSelectMultipleProps<TItem>

export function AsyncSelectField<TItem extends Record<string, any>>({
  label,
  placeholder,
  value,
  disabled = false,
  selectionMode = 'single',
  request,
  extractRows = data => data.items ?? [],
  columns,
  getRowId,
  onChange,
  error,
  helperText,
  getOptionLabel = item => item?.name ?? Object.values(item)[1] ?? '',
  dialogHeight = 600,
  dialogMaxWidth = 'sm',
}: AsyncSelectFieldProps<TItem>) {
  const [dialogOpen, setDialogOpen] = useState(false)

  const displayValue =
    selectionMode === 'single'
      ? value
        ? getOptionLabel(value as TItem)
        : ''
      : Array.isArray(value)
      ? value.map(v => getOptionLabel(v)).join(', ')
      : ''

  const handleSelect = (selected: TItem | TItem[] | null) => {
    if (selectionMode === 'multiple') {
      ;(onChange as (v: TItem[] | null) => void)(selected as TItem[] | null)
    } else {
      ;(onChange as (v: TItem | null) => void)(selected as TItem | null)
    }
    setDialogOpen(false)
  }

  return (
    <>
      <TextField
        label={label}
        value={displayValue}
        placeholder={placeholder}
        size='small'
        fullWidth
        disabled={disabled}
        onClick={() => !disabled && setDialogOpen(true)}
        error={error}
        helperText={helperText}
        InputProps={{
          endAdornment: <MoreHorizIcon sx={{ cursor: 'pointer' }} />,
        }}
      />

      <AsyncSelectDialog<TItem>
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={label}
        request={request}
        selected={value}
        extractRows={extractRows}
        columns={columns}
        selectionMode={selectionMode}
        getRowId={getRowId}
        onSelect={handleSelect}
        height={dialogHeight}
        maxWidth={dialogMaxWidth}
      />
    </>
  )
}
