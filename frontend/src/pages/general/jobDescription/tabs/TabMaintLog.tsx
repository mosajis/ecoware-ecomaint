import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import CellDateTime from '@/shared/components/dataGrid/cells/CellDateTime'
import { useCallback } from 'react'
import { tblMaintLog, TypeTblMaintLog } from '@/core/api/generated/api'
import { GridColDef } from '@mui/x-data-grid'
import { useDataGrid } from '@/shared/hooks/useDataGrid'

interface Props {
  label?: string
  jobDescriptionId: number
}

const getRowId = (row: TypeTblMaintLog) => row.maintLogId

const columns: GridColDef<TypeTblMaintLog>[] = [
  {
    field: 'component',
    headerName: 'Component',
    flex: 1,
    valueGetter: (_, r) => r?.tblComponentUnit?.compNo,
  },
  {
    field: 'jobCode',
    headerName: 'JobCode',
    width: 85,
    valueGetter: (_, r) => r?.tblJobDescription?.jobDescCode,
  },

  {
    field: 'job Title',
    headerName: 'JobTitle',
    flex: 1,
    valueGetter: (_, r) => r?.tblJobDescription?.jobDescTitle,
  },
  {
    field: 'dateDone',
    headerName: 'DateDone',
    width: 130,
    renderCell: ({ value }) => <CellDateTime value={value} />,
  },
  {
    field: 'maintClass',
    headerName: 'Maint Class',
    width: 100,
    valueGetter: (_, r) => r?.tblMaintClass?.descr,
  },
  {
    field: 'totalDuration',
    headerName: 'Total Duration',
    width: 120,
    valueGetter: (_, r) => r?.totalDuration,
  },

  {
    field: 'downTime',
    headerName: 'DownTime (Min)',
    width: 130,
    valueGetter: (_, r) => r?.downTime,
  },
]

export default function TabMaintLog(props: Props) {
  const { label, jobDescriptionId } = props

  const getAll = useCallback(() => {
    return tblMaintLog.getAll({
      filter: {
        jobDescId: jobDescriptionId,
      },
      include: {
        tblComponentUnit: true,
        tblJobDescription: true,
        tblMaintClass: true,
      },
    })
  }, [jobDescriptionId])

  const { rows, loading, handleRefresh } = useDataGrid(
    getAll,
    tblMaintLog.deleteById,
    'maintLogId',
    !!jobDescriptionId
  )

  return (
    <CustomizedDataGrid
      disableAdd
      disableEdit
      disableDelete
      disableRowNumber
      disableRowSelectionOnClick
      rows={rows}
      columns={columns}
      loading={loading}
      label={label}
      showToolbar={!!label}
      onRefreshClick={handleRefresh}
      getRowId={getRowId}
    />
  )
}
