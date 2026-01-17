import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import { useDataGrid } from '@/shared/hooks/useDataGrid'
import { GridColDef } from '@mui/x-data-grid'
import { useCallback } from 'react'
import {
  tblMaintLog,
  TypeTblMaintLog,
  TypeTblWorkOrder,
} from '@/core/api/generated/api'
import CellDateTime from '@/shared/components/dataGrid/cells/CellDateTime'

interface Props {
  workOrder?: TypeTblWorkOrder
  label?: string
}

const getRowId = (row: TypeTblMaintLog) => row.maintLogId

const columns: GridColDef<TypeTblMaintLog>[] = [
  {
    field: 'component',
    headerName: 'Component',
    flex: 1,
    valueGetter: (_, row) => row?.tblComponentUnit?.compNo,
  },
  {
    field: 'jobCode',
    headerName: 'Job Code',
    flex: 1,
    valueGetter: (_, row) => row?.tblJobDescription?.jobDescCode,
  },
  {
    field: 'jobName',
    headerName: 'Job Name',
    flex: 1,
    valueGetter: (_, row) => row?.tblJobDescription?.jobDescTitle,
  },
  {
    field: 'dateDone',
    headerName: 'Date Done',
    width: 130,
    renderCell: ({ value }) => <CellDateTime value={value} />,
  },

  {
    field: 'followStatus',
    headerName: 'Follow Status',
    flex: 1,
    valueGetter: (_, row) => row?.tblFollowStatus?.fsName,
  },
  {
    field: 'followCount',
    headerName: 'Follow Count',
    flex: 1,
    valueGetter: (_, row) => row?.overdueCount,
  },
  {
    field: 'empHrs',
    headerName: 'Emp / Hrs',
    flex: 1,
    valueGetter: (_, row) => row?.totalDuration,
  },
  {
    field: 'maintClass',
    headerName: 'Maint Class',
    flex: 1,
    valueGetter: (_, row) => row?.tblMaintClass?.descr,
  },
  {
    field: 'downTime',
    headerName: 'DownTime (min)',
    flex: 1,
    valueGetter: (_, row) => row?.downTime,
  },
  {
    field: 'compStatus',
    headerName: 'Comp Status',
    flex: 1,
    valueGetter: (_, row) =>
      // @ts-ignore
      row?.tblComponentUnit?.tblCompStatus?.compStatusName,
  },
  {
    field: 'isCritical',
    headerName: 'Is Critical',
    flex: 1,
    valueGetter: (_, row) => row.tblComponentUnit?.isCritical,
    type: 'boolean',
  },
  {
    field: 'unexpected',
    headerName: 'UnPlanned',
    flex: 1,
    type: 'boolean',
  },
]

const TabComponentLog = (props: Props) => {
  const { workOrder, label } = props

  const compId = workOrder?.compId
  const workOrderId = workOrder?.workOrderId

  const getAll = useCallback(
    () =>
      tblMaintLog.getAll({
        filter: {
          compId: compId,
        },
        include: {
          tblComponentUnit: {
            include: {
              tblCompStatus: true,
            },
          },
          tblFollowStatus: true,
          tblJobDescription: true,
          tblMaintClass: true,
        },
      }),
    [compId]
  )

  // === useDataGrid ===
  const { rows, loading, handleRefresh } = useDataGrid(
    getAll,
    tblMaintLog.deleteById,
    'maintLogId',
    !!workOrderId
  )

  return (
    <CustomizedDataGrid
      disableEdit
      disableDelete
      showToolbar={!!label}
      label={label}
      loading={loading}
      onRefreshClick={handleRefresh}
      getRowId={getRowId}
      rows={rows}
      columns={columns}
    />
  )
}

export default TabComponentLog
