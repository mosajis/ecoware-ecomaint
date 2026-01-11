import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import DisciplineFormDialog from './DisciplineUpsert'
import { useState, useCallback } from 'react'
import { tblDiscipline, TypeTblDiscipline } from '@/core/api/generated/api'
import { GridColDef } from '@mui/x-data-grid'
import { useDataGrid } from '@/shared/hooks/useDataGrid'

// === Columns ===
const columns: GridColDef<TypeTblDiscipline>[] = [
  { field: 'name', headerName: 'Name', flex: 1 },
  { field: 'orderNo', headerName: 'Order No', width: 80 },
]

export default function PageDiscipline() {
  const [openForm, setOpenForm] = useState(false)
  const [mode, setMode] = useState<'create' | 'update'>('create')
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null)

  // === Hook ===
  const { rows, loading, handleDelete, handleRefresh } = useDataGrid(
    tblDiscipline.getAll,
    tblDiscipline.deleteById,
    'discId'
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
  }, [setOpenForm])

  const handleUpsertOpen = useCallback(() => {
    setOpenForm(true)
  }, [setOpenForm])

  const getRowId = useCallback((row: TypeTblDiscipline) => row.discId, [])

  return (
    <>
      <CustomizedDataGrid
        loading={loading}
        showToolbar
        label='Discipline'
        rows={rows}
        columns={columns}
        onDeleteClick={handleDelete}
        onEditClick={handleEdit}
        onDoubleClick={handleEdit}
        onAddClick={handleCreate}
        getRowId={getRowId}
      />

      <DisciplineFormDialog
        open={openForm}
        mode={mode}
        recordId={selectedRowId}
        onClose={handleUpsertClose}
        onSuccess={handleRefresh}
      />
    </>
  )
}
