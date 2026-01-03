import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import { useCallback, useMemo, useState } from 'react'
import { GridColDef } from '@mui/x-data-grid'
import { useDataGrid } from '@/shared/hooks/useDataGrid'
import {
  tblCompTypeMeasurePoint,
  TypeTblCompType,
  TypeTblCompTypeMeasurePoint,
} from '@/core/api/generated/api'
import { dataGridActionColumn } from '@/shared/components/dataGrid/DataGridActionsColumn'
import MeasurePointUpsert from './TabMeasuresUpsert'

type Props = {
  compType?: TypeTblCompType | null
  label?: string
}

const TabMeasuresPage = ({ compType, label }: Props) => {
  const compTypeId = compType?.compTypeId

  const [openForm, setOpenForm] = useState(false)
  const [mode, setMode] = useState<'create' | 'update'>('create')
  const [selectedId, setSelectedId] = useState<number | null>(null)

  // === getAll ===
  const getAll = useCallback(() => {
    return tblCompTypeMeasurePoint.getAll({
      filter: { compTypeId },
      include: {
        tblUnit: true,
        tblCounterType: true,
      },
    })
  }, [compTypeId])

  // === useDataGrid ===
  const { rows, loading, handleDelete, handleRefresh, handleFormSuccess } =
    useDataGrid(
      getAll,
      tblCompTypeMeasurePoint.deleteById,
      'compTypeMeasurePointId',
      !!compTypeId
    )

  // === Handlers ===
  const handleCreate = () => {
    setSelectedId(null)
    setMode('create')
    setOpenForm(true)
  }

  const handleEdit = (row: TypeTblCompTypeMeasurePoint) => {
    setSelectedId(row.compTypeMeasurePointId)
    setMode('update')
    setOpenForm(true)
  }

  // === Columns ===
  const columns = useMemo<GridColDef<TypeTblCompTypeMeasurePoint>[]>(
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
        getRowId={row => row.compTypeMeasurePointId}
      />

      {/* === UPSERT === */}
      {compTypeId && (
        <MeasurePointUpsert
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

export default TabMeasuresPage
