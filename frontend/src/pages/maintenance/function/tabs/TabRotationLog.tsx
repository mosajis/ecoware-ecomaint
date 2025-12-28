import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import { useMemo } from 'react'
import { useDataGrid } from '@/shared/hooks/useDataGrid'
import { GridColDef } from '@mui/x-data-grid'
import { tblRotationLog, TypeTblRotationLog } from '@/core/api/generated/api'

interface TabRotationLogProps {
  functionId?: number | null
  label?: string | null
}

const TabRotationLog = ({ functionId, label }: TabRotationLogProps) => {
  const { rows, loading, handleRefresh } = useDataGrid(
    tblRotationLog.getAll,
    tblRotationLog.deleteById,
    'rotationLogId',
    !!functionId
  )

  const columns = useMemo<GridColDef<TypeTblRotationLog>[]>(
    () => [
      { field: 'compNo', headerName: 'Comp ID', width: 100 },
      { field: 'fromDate', headerName: 'From Date', width: 150 },
      { field: 'functionId', headerName: 'Function ID', width: 120 },
      { field: 'userInsertedId', headerName: 'User Inserted', width: 120 },
      { field: 'userRemovedId', headerName: 'User Removed', width: 120 },
      { field: 'notes', headerName: 'Notes', flex: 1 },
      { field: 'lastupdate', headerName: 'Last Update', width: 150 },
    ],
    []
  )

  return (
    <CustomizedDataGrid
      label={label ?? 'Rotation Log'}
      showToolbar
      rows={rows}
      columns={columns}
      loading={loading}
      onRefreshClick={handleRefresh}
      getRowId={row => row.rotationLogId}
    />
  )
}

export default TabRotationLog
