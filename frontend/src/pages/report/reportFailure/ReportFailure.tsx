import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import { GridColDef } from '@mui/x-data-grid'
import { useCallback, useState } from 'react'
import { useDataGrid } from '@/shared/hooks/useDataGrid'
import {
  tblFailureReports,
  TypeTblFailureReports,
} from '@/core/api/generated/api'

const getRowId = (row: TypeTblFailureReports) => row.failureReportId

const columns: GridColDef<TypeTblFailureReports>[] = [
  {
    field: 'compNo',
    headerName: 'Component Name',
    flex: 1,
    valueGetter: (_, row) => row?.tblComponentUnit?.comNo,
  },
]

export default function PageReportFailure() {
  const [openForm, setOpenForm] = useState(false)
  const [mode, setMode] = useState<'create' | 'update'>('create')
  const [selected, setSelected] = useState<number | null>(null)

  const getAll = useCallback(
    () =>
      tblFailureReports.getAll({
        include: {
          tblComponentUnit: true,
        },
      }),
    []
  )

  const { rows, loading, handleRefresh, handleDelete } = useDataGrid(
    getAll,
    tblFailureReports.deleteById,
    'failureReportId'
  )

  // === Handlers ===
  const handleCreate = useCallback(() => {
    setSelected(null)
    setMode('create')
    setOpenForm(true)
  }, [])

  const handleEdit = useCallback((rowId: number) => {
    setSelected(rowId)
    setMode('update')
    setOpenForm(true)
  }, [])

  return (
    <CustomizedDataGrid
      showToolbar
      label='Failure Report'
      loading={loading}
      rows={rows}
      columns={columns}
      onRefreshClick={handleRefresh}
      onAddClick={handleCreate}
      onEditClick={handleEdit}
      onDoubleClick={handleEdit}
      onDeleteClick={handleDelete}
      getRowId={getRowId}
    />
  )
}
