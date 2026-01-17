import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import { useDataGrid } from '@/shared/hooks/useDataGrid'
import { useCallback } from 'react'
import { columns } from '../../maintLog/MaintLogColumns'
import {
  tblMaintLog,
  TypeTblMaintLog,
  TypeTblWorkOrder,
} from '@/core/api/generated/api'

interface Props {
  workOrder?: TypeTblWorkOrder
  label?: string
}

const getRowId = (row: TypeTblMaintLog) => row.maintLogId

const TabMaintLog = (props: Props) => {
  const { workOrder, label } = props

  const compId = workOrder?.compId
  const jobDescId = workOrder?.tblCompJob?.jobDescId
  const workOrderId = workOrder?.workOrderId

  const getAll = useCallback(
    () =>
      tblMaintLog.getAll({
        filter: {
          compId: workOrder?.compId,
          jobDescId: workOrder?.tblCompJob?.jobDescId,
        },
        include: {
          tblWorkOrder: {
            include: {
              tblDiscipline: true,
            },
          },
          tblFollowStatus: true,
          tblComponentUnit: true,
          tblMaintClass: true,
          tblJobDescription: true,
        },
      }),
    [compId, jobDescId]
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
      disableRowSelectionOnClick
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

export default TabMaintLog
