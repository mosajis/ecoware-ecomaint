import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import PendingTypeUpsert from './PendingTypeUpsert'
import { useState, useCallback, useMemo } from 'react'
import { tblPendingType, TypeTblPendingType } from '@/core/api/generated/api'
import { GridColDef } from '@mui/x-data-grid'
import { dataGridActionColumn } from '@/shared/components/dataGrid/DataGridActionsColumn'
import { useDataGrid } from '@/shared/hooks/useDataGrid'

export default function PagePendingType() {
  const [openForm, setOpenForm] = useState(false)
  const [mode, setMode] = useState<'create' | 'update'>('create')
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null)

  const { rows, loading, handleRefresh, handleDelete, handleFormSuccess } =
    useDataGrid(tblPendingType.getAll, tblPendingType.deleteById, 'pendTypeId')

  const handleCreate = useCallback(() => {
    setSelectedRowId(null)
    setMode('create')
    setOpenForm(true)
  }, [])

  const handleEdit = useCallback((row: TypeTblPendingType) => {
    setSelectedRowId(row.pendTypeId)
    setMode('update')
    setOpenForm(true)
  }, [])

  const columns: GridColDef<TypeTblPendingType>[] = useMemo(
    () => [
      { field: 'pendTypeName', headerName: 'Name', flex: 2 },
      { field: 'description', headerName: 'Description', flex: 2 },
      dataGridActionColumn({ onEdit: handleEdit, onDelete: handleDelete }),
    ],
    [handleEdit, handleDelete]
  )

  return (
    <>
      <CustomizedDataGrid
        rows={rows}
        columns={columns}
        label='Pending Type'
        showToolbar
        loading={loading}
        getRowId={row => row.pendTypeId}
        onAddClick={handleCreate}
        onRefreshClick={handleRefresh}
      />

      {openForm && (
        <PendingTypeUpsert
          open={openForm}
          mode={mode}
          recordId={selectedRowId}
          onClose={() => setOpenForm(false)}
          onSuccess={record => {
            handleFormSuccess(record)
            setOpenForm(false)
          }}
        />
      )}
    </>
  )
}
