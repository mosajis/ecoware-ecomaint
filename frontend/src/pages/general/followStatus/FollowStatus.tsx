import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import FollowStatusUpsert from './FollowStatusUpsert'
import { useCallback, useState } from 'react'
import { tblFollowStatus, TypeTblFollowStatus } from '@/core/api/generated/api'
import { GridColDef } from '@mui/x-data-grid'
import { useDataGrid } from '@/shared/hooks/useDataGrid'

const getRowId = (row: TypeTblFollowStatus) => row.followStatusId

const columns: GridColDef<TypeTblFollowStatus>[] = [
  { field: 'fsName', headerName: 'Name', flex: 1 },
  { field: 'fsDesc', headerName: 'Description', flex: 2 },
  { field: 'orderNo', headerName: 'Order No', width: 80 },
]

export default function PageFollowStatus() {
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null)
  const [openForm, setOpenForm] = useState(false)
  const [mode, setMode] = useState<'create' | 'update'>('create')

  // === useDataGrid ===
  const { rows, loading, handleRefresh, handleDelete } = useDataGrid(
    tblFollowStatus.getAll,
    tblFollowStatus.deleteById,
    'followStatusId'
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
        label='Follow Status'
        rows={rows}
        columns={columns}
        loading={loading}
        getRowId={getRowId}
        onAddClick={handleCreate}
        onRefreshClick={handleRefresh}
        onDeleteClick={handleDelete}
        onEditClick={handleEdit}
        onDoubleClick={handleEdit}
      />

      <FollowStatusUpsert
        open={openForm}
        mode={mode}
        recordId={selectedRowId}
        onClose={handleUpsertClose}
        onSuccess={handleRefresh}
      />
    </>
  )
}
