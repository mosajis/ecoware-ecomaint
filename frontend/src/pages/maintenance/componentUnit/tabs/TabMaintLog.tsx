import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import { useCallback } from 'react'
import { useDataGrid } from '@/shared/hooks/useDataGrid'
import { columns } from '../../maintLog/MaintLogColumns'
import {
  tblMaintLog,
  TypeTblComponentUnit,
  TypeTblMaintLog,
} from '@/core/api/generated/api'

interface Props {
  componentUnit?: TypeTblComponentUnit
  label?: string
}

const getRowId = (row: TypeTblMaintLog) => row.maintLogId

const TabMaintLog = ({ componentUnit, label }: Props) => {
  const compId = componentUnit?.compId

  const getAll = useCallback(() => {
    return tblMaintLog.getAll({
      filter: {
        compId,
      },
      include: {
        tblWorkOrder: true,
        tblComponentUnit: true,
        tblMaintClass: true,
        tblJobDescription: true,
      },
    })
  }, [compId])

  const { rows, loading, handleRefresh } = useDataGrid(
    getAll,
    tblMaintLog.getById,
    'maintLogId',
    !!compId
  )

  return (
    <CustomizedDataGrid
      disableRowNumber
      label={label}
      showToolbar={!!label}
      rows={rows}
      columns={columns}
      loading={loading}
      onRefreshClick={handleRefresh}
      getRowId={getRowId}
    />
  )
}

export default TabMaintLog
