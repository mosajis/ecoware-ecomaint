import DataGridActions from './DataGridActions'
import { type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid'
import type { ReactNode } from 'react'

interface DataGridActionColumnProps {
  width?: number
  onEdit?: (row: any) => void
  onDelete?: (row: any) => void
  renderExtras?: (row: any) => ReactNode
}

export const dataGridActionColumn = ({
  width = 103,
  onEdit,
  onDelete,
  renderExtras,
}: DataGridActionColumnProps): GridColDef => ({
  field: 'actions',
  headerName: 'Actions',
  width,
  sortable: false,
  filterable: false,
  disableColumnMenu: true,
  renderCell: (params: GridRenderCellParams) => (
    <DataGridActions
      onEdit={onEdit ? () => onEdit(params.row) : undefined}
      onDelete={onDelete ? () => onDelete(params.row) : undefined}
    >
      {renderExtras?.(params.row)}
    </DataGridActions>
  ),
})
