import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'

const TabResourceUsed = () => {
  const columns = [
    { field: 'resourceName', headerName: 'Resource Name', flex: 1 },
    { field: 'discipline', headerName: 'Discipline', flex: 1 },
    { field: 'timeSpent', headerName: 'Time Spent', flex: 1 },
  ]

  return (
    <CustomizedDataGrid
      showToolbar
      label='Resource Used (not set)'
      rows={[]}
      columns={columns}
    />
  )
}

export default TabResourceUsed
