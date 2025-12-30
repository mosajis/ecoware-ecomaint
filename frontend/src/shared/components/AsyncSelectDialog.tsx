import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import CustomizedDataGrid from './dataGrid/DataGrid'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import { useEffect, useState, useCallback } from 'react'
import {
  GridRowId,
  GridRowIdGetter,
  GridRowSelectionModel,
} from '@mui/x-data-grid'

export interface SelectModalProps<TItem extends Record<string, any>> {
  open: boolean
  onClose: () => void
  title?: string

  request: () => Promise<any> // API call
  extractRows?: (data: any) => TItem[] // optional extractor

  columns: any[]
  selectionMode?: 'single' | 'multiple'
  onSelect: (selected: TItem | TItem[] | null) => void

  getRowId: GridRowIdGetter<TItem>
  selected?: TItem | TItem[] | null // مقدار اولیه برای edit

  height?: number | string
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false
}

export function AsyncSelectDialog<TItem extends Record<string, any>>({
  open,
  onClose,
  title = 'Select',
  request,
  extractRows,
  columns,
  onSelect,
  selectionMode = 'single',
  getRowId,
  selected = null,
  height = 600,
  maxWidth = 'md',
}: SelectModalProps<TItem>) {
  const [rows, setRows] = useState<TItem[]>([])
  const [loading, setLoading] = useState(false)
  const [selection, setSelection] = useState<GridRowSelectionModel>({
    type: 'include',
    ids: new Set<GridRowId>(),
  })

  // ---------------- Fetch Data ----------------
  const fetchData = useCallback(async () => {
    setLoading(true)

    try {
      const data = await request()
      const items: TItem[] = extractRows ? extractRows(data) : data.items ?? []
      setRows(Array.isArray(items) ? items : [])
    } finally {
      setLoading(false)
    }
  }, [request, extractRows])

  // ---------------- Initialize Selection ----------------
  useEffect(() => {
    if (open) {
      fetchData()
    }
  }, [open, fetchData])

  useEffect(() => {
    const initialIds = new Set<GridRowId>()
    if (selectionMode === 'single' && selected && !Array.isArray(selected)) {
      initialIds.add(getRowId(selected))
    } else if (selectionMode === 'multiple' && Array.isArray(selected)) {
      selected.forEach(item => initialIds.add(getRowId(item)))
    }
    setSelection({ type: 'include', ids: initialIds })
  }, [selected, selectionMode, getRowId])

  // ---------------- Handle OK ----------------
  const handleOk = () => {
    if (selectionMode === 'single') {
      const selectedId = Array.from(selection.ids)[0]
      const selectedItem = rows.find(r => getRowId(r) === selectedId) ?? null
      onSelect(selectedItem)
    } else {
      const selectedItems = rows.filter(r => selection.ids.has(getRowId(r)))
      onSelect(selectedItems)
    }
    onClose()
  }

  // ---------------- Handle Double Click ----------------
  const handleRowDoubleClick = ({ row }: { row: TItem }) => {
    const rowId = getRowId(row)
    const newSelection = {
      type: 'include' as const,
      ids: new Set<GridRowId>([rowId]),
    }
    setSelection(newSelection)

    // اگر single selection است، فوری اوکی کن
    if (selectionMode === 'single') {
      onSelect(row)
      onClose()
    }
  }

  // ---------------- Render ----------------
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth={maxWidth}>
      <DialogContent sx={{ height, p: 1 }}>
        <CustomizedDataGrid
          getRowId={getRowId}
          onRefreshClick={fetchData}
          label={title}
          rows={rows}
          columns={columns}
          loading={loading}
          showToolbar
          disableAdd
          disableColumnFilter
          disableDensity
          disableExport
          disableColumns
          checkboxSelection={selectionMode === 'multiple'}
          disableRowSelectionOnClick={false}
          onRowSelectionModelChange={setSelection}
          onRowDoubleClick={handleRowDoubleClick}
        />
      </DialogContent>
      <DialogActions sx={{ p: 0, m: 1 }}>
        <Button
          type='submit'
          variant='contained'
          color='secondary'
          sx={{ flex: 1 }}
          onClick={handleOk}
        >
          Ok
        </Button>
        <Button
          color='inherit'
          variant='outlined'
          sx={{ flex: 1 }}
          onClick={onClose}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}
