import Splitter from '@/shared/components/Splitter/Splitter'
import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import CounterTypeTabs from './CounterTypeTabs'
import CounterTypeUpsert from './CounterTypeUpsert'
import { useState, useCallback } from 'react'
import { tblCounterType, TypeTblCounterType } from '@/core/api/generated/api'
import { useDataGrid } from '@/shared/hooks/useDataGrid'
import { GridColDef } from '@mui/x-data-grid'

const getRowId = (row: TypeTblCounterType) => row.counterTypeId

const columns: GridColDef<TypeTblCounterType>[] = [
  { field: 'name', headerName: 'Name', flex: 1 },

  {
    field: 'type',
    headerName: 'Type',
    width: 120,
    valueGetter: (_, row) => (row.type === 3 ? 'Measure Point' : 'Counter'),
  },
  { field: 'orderNo', headerName: 'Order No', width: 80 },
]

export default function PageCounterType() {
  const [openForm, setOpenForm] = useState(false)
  const [mode, setMode] = useState<'create' | 'update'>('create')
  const [label, setLabel] = useState<string | null>(null)
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null)

  const { rows, loading, handleDelete, handleRefresh } = useDataGrid(
    tblCounterType.getAll,
    tblCounterType.deleteById,
    'counterTypeId'
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

  const handleRowClick = useCallback(({ row }: { row: TypeTblCounterType }) => {
    setSelectedRowId(row.counterTypeId)
    setLabel(row.name)
  }, [])

  return (
    <>
      <Splitter initialPrimarySize='35%'>
        <CustomizedDataGrid
          showToolbar
          disableDensity
          disableColumns
          disableExport
          rowSelection
          label='Counter Type'
          rows={rows}
          columns={columns}
          loading={loading}
          onEditClick={handleEdit}
          onDoubleClick={handleEdit}
          onDeleteClick={handleDelete}
          onAddClick={handleCreate}
          onRefreshClick={handleRefresh}
          getRowId={getRowId}
          onRowClick={handleRowClick}
        />

        <CounterTypeTabs counterTypeId={selectedRowId} label={label} />
      </Splitter>
      <CounterTypeUpsert
        open={openForm}
        mode={mode}
        recordId={selectedRowId}
        onClose={handleUpsertClose}
        onSuccess={handleRefresh}
      />
    </>
  )
}
