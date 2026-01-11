import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import JobClassUpsert from './JobClassUpsert'
import { useState, useCallback } from 'react'
import { tblJobClass, TypeTblJobClass } from '@/core/api/generated/api'
import { GridColDef } from '@mui/x-data-grid'
import { useDataGrid } from '@/shared/hooks/useDataGrid'

const getRowId = (row: TypeTblJobClass) => row.jobClassId

// === Columns ===
const columns: GridColDef<TypeTblJobClass>[] = [
  { field: 'code', headerName: 'Code', width: 60 },
  { field: 'name', headerName: 'Name', flex: 1 },
  { field: 'orderNo', headerName: 'Order No', width: 80 },
]

export default function PageJobClass() {
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null)
  const [openForm, setOpenForm] = useState(false)
  const [mode, setMode] = useState<'create' | 'update'>('create')

  // === useDataGrid ===
  const { rows, loading, handleRefresh, handleDelete } = useDataGrid(
    tblJobClass.getAll,
    tblJobClass.deleteById,
    'jobClassId'
  )

  // === Handlers ===
  const handleCreate = useCallback(() => {
    setSelectedRowId(null)
    setMode('create')
    handleUpsertOpen()
  }, [])

  const handleEdit = useCallback((rowId: number) => {
    setSelectedRowId(rowId)
    setMode('update')
    handleUpsertOpen()
  }, [])

  const handleUpsertClose = useCallback(() => {
    setOpenForm(false)
  }, [])

  const handleUpsertOpen = useCallback(() => {
    setOpenForm(true)
  }, [])
  return (
    <>
      <CustomizedDataGrid
        showToolbar
        label='Job Class'
        rows={rows}
        columns={columns}
        loading={loading}
        getRowId={getRowId}
        onAddClick={handleCreate}
        onEditClick={handleEdit}
        onDoubleClick={handleEdit}
        onDeleteClick={handleDelete}
        onRefreshClick={handleRefresh}
      />

      <JobClassUpsert
        open={openForm}
        mode={mode}
        recordId={selectedRowId}
        onClose={handleUpsertClose}
        onSuccess={handleRefresh}
      />
    </>
  )
}
