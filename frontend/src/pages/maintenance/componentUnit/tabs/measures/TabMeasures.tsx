import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import Upsert from './TabMeasuresUpsert'
import { useCallback, useState } from 'react'
import { GridColDef } from '@mui/x-data-grid'
import { useDataGrid } from '@/shared/hooks/useDataGrid'
import {
  tblCompMeasurePoint,
  TypeTblComponentUnit,
  TypeTblCompMeasurePoint,
} from '@/core/api/generated/api'

type Props = {
  componentUnit?: TypeTblComponentUnit | null
  label?: string
}

const getRowId = (row: TypeTblCompMeasurePoint) => row.compMeasurePointId

// === Columns ===
const columns: GridColDef<TypeTblCompMeasurePoint>[] = [
  {
    field: 'measureName',
    headerName: 'Measure',
    flex: 1,
    valueGetter: (_, row) => row.tblCounterType?.name || '',
  },
  {
    field: 'unitName',
    headerName: 'Unit',
    flex: 1,
    valueGetter: (_, row) => row.tblUnit?.name || '',
  },
  {
    field: 'unitDescription',
    headerName: 'Unit Description',
    flex: 1,
    valueGetter: (_, row) => row.tblUnit?.description || '',
  },
  {
    field: 'currentValue',
    headerName: 'Current Value',
    width: 120,
  },
  { field: 'setValue', headerName: 'Set Value', width: 110 },
  { field: 'operationalMinValue', headerName: 'Min', width: 100 },
  { field: 'operationalMaxValue', headerName: 'Max', width: 100 },
  { field: 'orderNo', headerName: 'Order', width: 80 },
]

const TabCompMeasurePoint = ({ componentUnit, label }: Props) => {
  const compId = componentUnit?.compId

  const [openForm, setOpenForm] = useState(false)
  const [mode, setMode] = useState<'create' | 'update'>('create')
  const [selectedId, setSelectedId] = useState<number | null>(null)

  // === getAll ===
  const getAll = useCallback(() => {
    return tblCompMeasurePoint.getAll({
      filter: { compId },
      include: {
        tblUnit: true,
        tblCounterType: true,
        tblCompJobMeasurePoints: true,
      },
    })
  }, [compId])

  // === useDataGrid ===
  const { rows, loading, handleDelete, handleRefresh } = useDataGrid(
    getAll,
    tblCompMeasurePoint.deleteById,
    'compMeasurePointId',
    !!compId
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
        showToolbar={!!label}
        label={label}
        rows={rows}
        columns={columns}
        loading={loading}
        onRefreshClick={handleRefresh}
        onAddClick={handleCreate}
        onEditClick={handleEdit}
        onDoubleClick={handleEdit}
        onDeleteClick={handleDelete}
        getRowId={getRowId}
      />

      <Upsert
        open={openForm}
        mode={mode}
        recordId={selectedId}
        compId={compId!}
        onClose={handleUpsertClose}
        onSuccess={handleRefresh}
      />
    </>
  )
}

export default TabCompMeasurePoint
