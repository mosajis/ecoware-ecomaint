import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import { useMemo } from 'react'
import { GridColDef } from '@mui/x-data-grid'
import { useDataGrid } from '@/shared/hooks/useDataGrid'
import { formatDateTime } from '@/core/api/helper'

const Users = () => {
  //   // === useDataGrid ===
  //   const { rows, loading, handleRefresh } = useDataGrid<TypeTblUsers>(
  //     tblUser,
  //     tblUsers.deleteById, // استفاده نمی‌شود ولی hook نیاز دارد
  //     "userId"
  //   );

  // === Columns ===
  const columns = useMemo<GridColDef<any>[]>(
    () => [
      {
        field: 'group',
        headerName: 'Group',
        width: 140,
        valueGetter: (_, row) => row?.tblGroup?.name,
      },
      {
        field: 'name',
        headerName: 'Name',
        width: 160,
      },
      {
        field: 'username',
        headerName: 'Username',
        width: 140,
        valueGetter: (_, row) => row?.username,
      },
      {
        field: 'title',
        headerName: 'Title',
        width: 160,
      },
      {
        field: 'lastLogin',
        headerName: 'Last Login',
        width: 160,
        valueFormatter: value => (value ? formatDateTime(value) : ''),
      },
      {
        field: 'forceChangePassword',
        headerName: 'Force Change Password',
        width: 190,
        type: 'boolean',
      },
      {
        field: 'positionName',
        headerName: 'Position Name',
        width: 160,
        valueGetter: (_, row) => row?.tblPosition?.name,
      },
    ],
    []
  )

  return (
    <CustomizedDataGrid
      label='Users'
      showToolbar
      //   onRefreshClick={handleRefresh}
      rows={[]}
      columns={columns}
      //   loading={loading}
      //   getRowId={(row) => row.userId}
    />
  )
}

export default Users
