import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import JobMeasureUpsert from './TabMasuresUpsert' // فرض می‌کنم که این کامپوننت قبلاً ساخته شده
import { useCallback, useMemo, useState } from 'react'
import { GridColDef } from '@mui/x-data-grid'
import { useDataGrid } from '@/shared/hooks/useDataGrid'
import { dataGridActionColumn } from '@/shared/components/dataGrid/DataGridActionsColumn'
import {
  tblCompTypeJobMeasurePoint,
  tblCompTypeMeasurePoint,
  TypeTblCompTypeJob,
  TypeTblCompTypeJobMeasurePoint,
} from '@/core/api/generated/api'

type Props = {
  compTypeJob?: TypeTblCompTypeJob | null
}

const TabMeasuresPage = ({ compTypeJob }: Props) => {
  const [openForm, setOpenForm] = useState(false)
  const [mode, setMode] = useState<'create' | 'update'>('create')
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const compTypeJobId = compTypeJob?.compTypeJobId
  const compTypeId = compTypeJob?.compTypeId

  // === getAll callback ===
  const getAll = useCallback(() => {
    return tblCompTypeJobMeasurePoint.getAll({
      include: {
        tblCompTypeMeasurePoint: {
          include: {
            tblUnit: true,
            tblCounterType: true,
          },
        },
      },
      filter: {
        compTypeJobId: compTypeJob?.compTypeJobId,
      },
    })
  }, [compTypeJob?.compTypeJobId])

  // === useDataGrid ===
  const { rows, loading, handleRefresh, handleDelete } = useDataGrid(
    getAll,
    tblCompTypeJobMeasurePoint.deleteById,
    'compTypeJobMeasurePointId',
    !!compTypeJob
  )

  // === Handlers ===
  const handleCreate = () => {
    setSelectedId(null)
    setMode('create')
    setOpenForm(true)
  }

  const handleEdit = (row: TypeTblCompTypeJobMeasurePoint) => {
    setSelectedId(row.compTypeJobMeasurePointId)
    setMode('update')
    setOpenForm(true)
  }

  // === Columns ===
  const columns = useMemo<GridColDef<TypeTblCompTypeJobMeasurePoint>[]>(
    () => [
      {
        field: 'measureName',
        headerName: 'Measure Name',
        flex: 1,
        valueGetter: (v, row) =>
          // @ts-ignore
          row?.tblCompTypeMeasurePoint?.tblCounterType?.name,
      },
      {
        field: 'unitName',
        headerName: 'Unit Name',
        flex: 1,
        // @ts-ignore
        valueGetter: (v, row) => row?.tblCompTypeMeasurePoint?.tblUnit?.name,
      },
      {
        field: 'unitDescription',
        headerName: 'Unit Description',
        flex: 1,
        // @ts-ignore
        valueGetter: (v, row) =>
          // @ts-ignore
          row?.tblCompTypeMeasurePoint?.tblUnit?.description,
      },

      {
        field: 'minValue',
        headerName: 'Min Value',
        flex: 1,
      },
      {
        field: 'maxValue',
        headerName: 'Max Value',
        flex: 1,
      },
      {
        field: 'updateOnReport',
        headerName: 'Update On Report',
        flex: 1,
        type: 'boolean',
      },
      {
        field: 'useOperationalValues',
        headerName: 'use Operational Values',
        flex: 1,
        type: 'boolean',
      },
      dataGridActionColumn({ onDelete: handleDelete, onEdit: handleEdit }),
    ],
    [handleDelete]
  )

  return (
    <>
      <CustomizedDataGrid
        label={compTypeJob?.tblJobDescription?.jobDescTitle || 'Measure Points'}
        rows={rows}
        columns={columns}
        loading={loading}
        showToolbar
        onRefreshClick={handleRefresh}
        getRowId={row => row.compTypeJobMeasurePointId}
        onAddClick={handleCreate}
      />

      {/* === UPSERT === */}
      {compTypeJobId && compTypeId && (
        <JobMeasureUpsert
          open={openForm}
          mode={mode}
          recordId={selectedId}
          compTypeJobId={compTypeJobId}
          compTypeId={compTypeId}
          onClose={() => setOpenForm(false)}
          onSuccess={handleRefresh}
        />
      )}
    </>
  )
}

export default TabMeasuresPage
