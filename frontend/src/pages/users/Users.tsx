import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import CellDateTime from '@/shared/components/dataGrid/cells/CellDateTime'
import { GridColDef } from '@mui/x-data-grid'
import { useDataGrid } from '@/shared/hooks/useDataGrid'
import { tblUsers, TypeTblUsers } from '@/core/api/generated/api'

const getRowId = (row: TypeTblUsers) => row.userId
// === Columns ===
const columns: GridColDef<TypeTblUsers>[] = [
  {
    field: 'uName',
    headerName: 'Name',
  },
  {
    field: 'uUserName',
    headerName: 'Username',
  },
  {
    field: 'uTitle',
    headerName: 'Title',
  },
  {
    field: 'uLastUpdated',
    headerName: 'Last Login',
    width: 130,
    renderCell: ({ value }) => <CellDateTime value={value} />,
  },
  {
    field: 'forceChangePassword',
    headerName: 'Force Change Password',
    width: 190,
    type: 'boolean',
  },
  {
    field: 'uAccountDisabled',
    headerName: 'Account Disabled',
    width: 140,
    type: 'boolean',
  },
]

const Users = () => {
  const { rows, loading, handleRefresh } = useDataGrid<TypeTblUsers>(
    tblUsers.getAll,
    tblUsers.deleteById,
    'userId'
  )

  return (
    <CustomizedDataGrid
      label='Users'
      showToolbar
      onRefreshClick={handleRefresh}
      rows={rows}
      columns={columns}
      loading={loading}
      getRowId={getRowId}
    />
  )
}

export default Users
