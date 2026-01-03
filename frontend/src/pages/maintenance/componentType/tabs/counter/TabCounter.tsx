import CounterUpsert from './TabCounterUpsert'
import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import { useCallback, useMemo, useState } from 'react'
import { GridColDef } from '@mui/x-data-grid'
import { useDataGrid } from '@/shared/hooks/useDataGrid'
import { dataGridActionColumn } from '@/shared/components/dataGrid/DataGridActionsColumn'
import {
  tblCompTypeCounter,
  TypeTblCompType,
  TypeTblCompTypeCounter,
} from '@/core/api/generated/api'

type Props = {
  compType?: TypeTblCompType | null
  label?: string
}

const TabCounter = ({ compType, label }: Props) => {
  const compTypeId = compType?.compTypeId

  const [openForm, setOpenForm] = useState(false)
  const [mode, setMode] = useState<'create' | 'update'>('create')
  const [selectedId, setSelectedId] = useState<number | null>(null)

  // === getAll ===
  const getAll = useCallback(() => {
    return tblCompTypeCounter.getAll({
      include: {
        tblCounterType: true,
        tblCompTypeJobCounters: true,
      },
      filter: {
        compTypeId,
      },
    })
  }, [compTypeId])

  // === useDataGrid ===
  const { rows, loading, handleDelete, handleRefresh, handleFormSuccess } =
    useDataGrid(
      getAll,
      tblCompTypeCounter.deleteById,
      'compTypeCounterId',
      !!compTypeId
    )

  // === Handlers ===
  const handleCreate = () => {
    setSelectedId(null)
    setMode('create')
    setOpenForm(true)
  }

  const handleEdit = (row: TypeTblCompTypeCounter) => {
    setSelectedId(row.compTypeCounterId)
    setMode('update')
    setOpenForm(true)
  }

  // === Columns ===
  const columns = useMemo<GridColDef<TypeTblCompTypeCounter>[]>(
    () => [
      {
        field: 'counterType',
        headerName: 'Counter Type',
        flex: 1,
        valueGetter: (_, row) => row.tblCounterType?.name || '',
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
        label={label || 'Counter'}
        rows={rows}
        columns={columns}
        loading={loading}
        showToolbar
        onRefreshClick={handleRefresh}
        onAddClick={handleCreate}
        getRowId={row => row.compTypeCounterId}
      />

      {/* === UPSERT === */}
      {compTypeId && (
        <CounterUpsert
          open={openForm}
          mode={mode}
          recordId={selectedId}
          compTypeId={compTypeId}
          onClose={() => setOpenForm(false)}
          onSuccess={handleRefresh}
        />
      )}
    </>
  )
}

export default TabCounter
