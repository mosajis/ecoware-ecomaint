import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid' // مسیرت رو درست کن
import {
  tblFollowStatus,
  tblMaintLogFollow,
  TypeTblMaintLog,
  TypeTblMaintLogFollow,
} from '@/core/api/generated/api'
import { GridColDef } from '@mui/x-data-grid'
import { useCallback } from 'react'
import { useDataGrid } from '@/shared/hooks/useDataGrid'
import CellBoolean from '@/shared/components/dataGrid/cells/CellBoolean'

type props = {
  selected: TypeTblMaintLog
  label?: string
}

// follow status
// maintLogFollow
const TabFollow = (props: props) => {
  const { label, selected } = props

  const columns: GridColDef<TypeTblMaintLogFollow>[] = [
    {
      field: 'followBy',
      headerName: 'Follow By',
      flex: 1,
      valueGetter: (_, row) => row.users?.uUserName,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      valueGetter: (_, row) => row.tblFollowStatus?.fsName,
    },
    {
      field: 'isRequest',
      headerName: 'Is Request',
      flex: 1,
      renderCell: ({ row }) => <CellBoolean status={row.isRequest} />,
    },
    {
      field: 'isUnPlan',
      headerName: 'Unplanned',
      flex: 1,
      renderCell: ({ row }) => <CellBoolean status={row.isUnPlan} />,
    },
    { field: 'waitingTime', headerName: 'Waiting (Minutes)', flex: 1 },
    { field: 'followDate', headerName: 'Follow Date (not set)', flex: 1 },
  ]

  // === DataGrid ===
  const getAll = useCallback(() => {
    return tblMaintLogFollow.getAll({
      filter: {
        maintLogId: selected.maintLogId,
      },
      include: {
        tblFollowStatus: true,
        users: true,
      },
    })
  }, [selected?.maintLogId])

  const { rows, loading, handleRefresh, handleDelete } = useDataGrid(
    getAll,
    tblMaintLogFollow.deleteById,
    'followId',
    !!selected?.maintLogId
  )

  return (
    <CustomizedDataGrid
      showToolbar
      loading={loading}
      label={label || 'Follow (not set)'}
      rows={rows}
      getRowId={row => row.followId}
      onRefreshClick={handleRefresh}
      columns={columns}
    />
  )
}

export default TabFollow
