import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import PendingTypeUpsert from './PendingTypeUpsert'
import { useState, useCallback } from 'react'
import { tblPendingType, TypeTblPendingType } from '@/core/api/generated/api'
import { GridColDef } from '@mui/x-data-grid'
import { useDataGrid } from '@/shared/hooks/useDataGrid'

const getRowId = (row: TypeTblPendingType) => row.pendTypeId

const columns: GridColDef<TypeTblPendingType>[] = [
  { field: 'pendTypeName', headerName: 'Name', flex: 2 },
  { field: 'description', headerName: 'Description', flex: 2 },
  { field: 'orderNo', headerName: 'Order No', width: 120 },
]

export default function PagePendingType() {
  const [openForm, setOpenForm] = useState(false)
  const [mode, setMode] = useState<'create' | 'update'>('create')
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null)

  const { rows, loading, handleRefresh, handleDelete } = useDataGrid(
    tblPendingType.getAll,
    tblPendingType.deleteById,
    'pendTypeId'
  )

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
        label='Pending Type'
        rows={rows}
        columns={columns}
        loading={loading}
        onDeleteClick={handleDelete}
        onEditClick={handleEdit}
        onDoubleClick={handleEdit}
        onAddClick={handleCreate}
        getRowId={getRowId}
      />

      <PendingTypeUpsert
        open={openForm}
        mode={mode}
        recordId={selectedRowId}
        onClose={handleUpsertClose}
        onSuccess={handleRefresh}
      />
    </>
  )
}
