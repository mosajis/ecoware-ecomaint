import Splitter from '@/shared/components/Splitter/Splitter'
import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import CounterTypeTabs from './CounterTypeTabs'
import CounterTypeUpsert from './CounterTypeUpsert'
import { useState, useCallback } from 'react'
import { dataGridActionColumn } from '@/shared/components/dataGrid/DataGridActionsColumn'
import { tblCounterType, TypeTblCounterType } from '@/core/api/generated/api'
import { useDataGrid } from '@/shared/hooks/useDataGrid'

export default function PageCounterType() {
  const [openForm, setOpenForm] = useState(false)
  const [mode, setMode] = useState<'create' | 'update'>('create')
  const [selected, setSelected] = useState<TypeTblCounterType | null>(null)

  const {
    rows: counterTypes,
    loading: loadingCounterTypes,
    handleDelete: deleteCounterType,
    handleFormSuccess: counterTypeFormSuccess,
    handleRefresh,
  } = useDataGrid(
    tblCounterType.getAll,
    tblCounterType.deleteById,
    'counterTypeId'
  )

  // Handlers
  const handleCreate = useCallback(() => {
    setSelected(null)
    setMode('create')
    setOpenForm(true)
  }, [])

  const handleEdit = useCallback((row: TypeTblCounterType) => {
    setSelected(row)
    setMode('update')
    setOpenForm(true)
  }, [])

  return (
    <>
      <Splitter initialPrimarySize='35%'>
        {/* Left Grid */}
        <CustomizedDataGrid
          rows={counterTypes}
          columns={[
            { field: 'name', headerName: 'Name', flex: 1 },

            {
              field: 'type',
              headerName: 'Type',
              width: 130,
              valueGetter: (_, row) =>
                row.type === 3 ? 'Measure Point' : 'Counter',
            },
            { field: 'orderNo', headerName: 'Order No', width: 100 },
            dataGridActionColumn({
              onEdit: handleEdit,
              onDelete: deleteCounterType,
            }),
          ]}
          loading={loadingCounterTypes}
          label='Counter Type'
          showToolbar
          disableDensity
          disableColumns
          disableExport
          onAddClick={handleCreate}
          onRefreshClick={handleRefresh}
          getRowId={row => row.counterTypeId}
          rowSelection
          onRowClick={params => setSelected(params.row)}
        />

        <CounterTypeTabs
          counterTypeId={selected?.counterTypeId}
          label={selected?.name}
        />
      </Splitter>
      <CounterTypeUpsert
        open={openForm}
        mode={mode}
        recordId={selected?.counterTypeId}
        onClose={() => setOpenForm(false)}
        onSuccess={record => {
          counterTypeFormSuccess(record)
          setOpenForm(false)
        }}
      />
    </>
  )
}
