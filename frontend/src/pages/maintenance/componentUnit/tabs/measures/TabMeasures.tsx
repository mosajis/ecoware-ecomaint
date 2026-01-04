import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import { useCallback, useMemo, useState } from 'react'
import { GridColDef } from '@mui/x-data-grid'
import { useDataGrid } from '@/shared/hooks/useDataGrid'
import {
  tblCompMeasurePoint,
  TypeTblComponentUnit,
  TypeTblCompMeasurePoint,
} from '@/core/api/generated/api'
import { dataGridActionColumn } from '@/shared/components/dataGrid/DataGridActionsColumn'
import Upsert from './TabMeasuresUpsert'

type Props = {
  componentUnit?: TypeTblComponentUnit | null
  label?: string
}

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
  const { rows, loading, handleDelete, handleRefresh, handleFormSuccess } =
    useDataGrid(
      getAll,
      tblCompMeasurePoint.deleteById,
      'compMeasurePointId',
      !!compId
    )

  // === Handlers ===
  const handleCreate = () => {
    setSelectedId(null)
    setMode('create')
    setOpenForm(true)
  }

  const handleEdit = (row: TypeTblCompMeasurePoint) => {
    setSelectedId(row.compMeasurePointId)
    setMode('update')
    setOpenForm(true)
  }

  // === Columns ===
  const columns = useMemo<GridColDef<TypeTblCompMeasurePoint>[]>(
    () => [
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
        label={label || 'Measure Points'}
        rows={rows}
        columns={columns}
        loading={loading}
        showToolbar
        disableRowSelectionOnClick
        onRefreshClick={handleRefresh}
        onAddClick={handleCreate}
        getRowId={row => row.compMeasurePointId}
      />

      {/* === UPSERT === */}
      {compId && (
        <Upsert
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

export default TabCompMeasurePoint
