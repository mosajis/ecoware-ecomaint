import CounterUpsert from './TabCounterUpsert'
import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import { useCallback, useState } from 'react'
import { GridColDef } from '@mui/x-data-grid'
import { useDataGrid } from '@/shared/hooks/useDataGrid'
import {
  tblCompTypeCounter,
  TypeTblCompType,
  TypeTblCompTypeCounter,
} from '@/core/api/generated/api'

type Props = {
  compType?: TypeTblCompType
  label?: string
}

const getRowId = (row: TypeTblCompTypeCounter) => row.compTypeCounterId

// === Columns ===
const columns: GridColDef<TypeTblCompTypeCounter>[] = [
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
]

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
  const { rows, loading, handleDelete, handleRefresh } = useDataGrid(
    getAll,
    tblCompTypeCounter.deleteById,
    'compTypeCounterId',
    !!compTypeId
  )

  // === Handlers ===
  const handleCreate = () => {
    setSelectedId(null)
    setMode('create')
    handleUpsertOpen()
  }

  const handleEdit = (rowId: number) => {
    setSelectedId(rowId)
    setMode('update')
    handleUpsertOpen()
  }

  const handleUpsertClose = useCallback(() => {
    setOpenForm(false)
  }, [])

  const handleUpsertOpen = useCallback(() => {
    setOpenForm(true)
  }, [])

  return (
    <>
      <CustomizedDataGrid
        label={label}
        showToolbar={!!label}
        rows={rows}
        columns={columns}
        loading={loading}
        onAddClick={handleCreate}
        onDeleteClick={handleDelete}
        onDoubleClick={handleEdit}
        onEditClick={handleEdit}
        onRefreshClick={handleRefresh}
        getRowId={getRowId}
      />

      <CounterUpsert
        open={openForm}
        mode={mode}
        recordId={selectedId}
        compTypeId={compTypeId!}
        onClose={handleUpsertClose}
        onSuccess={handleRefresh}
      />
    </>
  )
}

export default TabCounter
