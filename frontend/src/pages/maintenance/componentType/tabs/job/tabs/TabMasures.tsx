import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import JobMeasureUpsert from './TabMasuresUpsert'
import { useCallback, useState } from 'react'
import { GridColDef } from '@mui/x-data-grid'
import { useDataGrid } from '@/shared/hooks/useDataGrid'
import {
  tblCompTypeJobMeasurePoint,
  TypeTblCompTypeJob,
  TypeTblCompTypeJobMeasurePoint,
} from '@/core/api/generated/api'

type Props = {
  compTypeJob?: TypeTblCompTypeJob
}

const getRowId = (row: TypeTblCompTypeJobMeasurePoint) =>
  row.compTypeJobMeasurePointId
// === Columns ===
const columns: GridColDef<TypeTblCompTypeJobMeasurePoint>[] = [
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
]

const TabMeasuresPage = ({ compTypeJob }: Props) => {
  const [openForm, setOpenForm] = useState(false)
  const [mode, setMode] = useState<'create' | 'update'>('create')
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const compTypeJobId = compTypeJob?.compTypeJobId
  const compTypeId = compTypeJob?.compTypeId

  const label = compTypeJob?.tblJobDescription?.jobDescTitle || ''

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
        compTypeJobId,
      },
    })
  }, [compTypeJobId])

  // === useDataGrid ===
  const { rows, loading, handleRefresh, handleDelete } = useDataGrid(
    getAll,
    tblCompTypeJobMeasurePoint.deleteById,
    'compTypeJobMeasurePointId',
    !!compTypeJobId
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
        loading={loading}
        columns={columns}
        onAddClick={handleCreate}
        onEditClick={handleEdit}
        onDoubleClick={handleEdit}
        onDeleteClick={handleDelete}
        onRefreshClick={handleRefresh}
        getRowId={getRowId}
      />

      <JobMeasureUpsert
        open={openForm}
        mode={mode}
        recordId={selectedId}
        compTypeJobId={compTypeJobId!}
        compTypeId={compTypeId!}
        onClose={handleUpsertClose}
        onSuccess={handleRefresh}
      />
    </>
  )
}

export default TabMeasuresPage
