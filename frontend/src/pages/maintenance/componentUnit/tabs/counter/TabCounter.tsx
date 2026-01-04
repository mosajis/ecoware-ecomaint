import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import TabCounterUpsert from './TabCounterUpsert'
import { useCallback, useMemo, useState } from 'react'
import { GridColDef } from '@mui/x-data-grid'
import { useDataGrid } from '@/shared/hooks/useDataGrid'
import { dataGridActionColumn } from '@/shared/components/dataGrid/DataGridActionsColumn'
import {
  tblCompCounter,
  TypeTblComponentUnit,
  TypeTblCompCounter,
} from '@/core/api/generated/api'

type Props = {
  componentUnit?: TypeTblComponentUnit | null
  label?: string
}

const TabCompCounter = ({ componentUnit, label }: Props) => {
  const compId = componentUnit?.compId
  const [openForm, setOpenForm] = useState(false)
  const [mode, setMode] = useState<'create' | 'update'>('create')
  const [selectedId, setSelectedId] = useState<number | null>(null)

  // === getAll ===
  const getAll = useCallback(() => {
    return tblCompCounter.getAll({
      include: {
        tblCounterType: true,
        tblCompCounterLogs: true,
        tblCompJobCounters: true,
      },
      filter: {
        compId,
      },
    })
  }, [compId])

  // === useDataGrid ===
  const { rows, loading, handleDelete, handleRefresh } = useDataGrid(
    getAll,
    tblCompCounter.deleteById,
    'compCounterId',
    !!compId
  )

  // === Handlers ===
  const handleCreate = () => {
    setSelectedId(null)
    setMode('create')
    setOpenForm(true)
  }

  const handleEdit = (row: TypeTblCompCounter) => {
    setSelectedId(row.compCounterId)
    setMode('update')
    setOpenForm(true)
  }

  // === Columns ===
  const columns = useMemo<GridColDef[]>(
    () => [
      {
        field: 'counterType',
        headerName: 'Counter Type',
        flex: 1,
        valueGetter: (_, row) => row.tblCounterType?.name || '',
      },
      {
        field: 'currentValue',
        headerName: 'Current Value',
        width: 120,
      },
      {
        field: 'startValue',
        headerName: 'Start Value',
        width: 120,
      },
      {
        field: 'averageCountRate',
        headerName: 'Avg Rate',
        width: 120,
      },
      {
        field: 'orderNo',
        headerName: 'Order',
        width: 90,
      },
      dataGridActionColumn({
        onEdit: handleEdit,
        onDelete: handleDelete,
      }),
    ],
    [handleDelete]
  )

  return (
    <>
      <CustomizedDataGrid
        label={label || 'Counters'}
        columns={columns}
        showToolbar
        rows={rows}
        loading={loading}
        onAddClick={handleCreate}
        getRowId={row => row.compCounterId}
      />

      {/* === UPSERT === */}
      {compId && (
        <TabCounterUpsert
          open={openForm}
          mode={mode}
          recordId={selectedId}
          compId={compId}
          onClose={() => setOpenForm(false)}
          onSuccess={handleRefresh}
        />
      )}
    </>
  )
}

export default TabCompCounter
