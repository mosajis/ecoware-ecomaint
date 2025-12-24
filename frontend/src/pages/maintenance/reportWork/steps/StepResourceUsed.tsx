import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import ReportWorkStep from '../ReportWorkStep'

const TabResourceUsed = () => {
  const columns = [
    { field: 'resourceName', headerName: 'Resource Name', flex: 1 },
    { field: 'discipline', headerName: 'Discipline', flex: 1 },
    { field: 'timeSpent', headerName: 'Time Spent', flex: 1 },
  ]

  return (
    <ReportWorkStep>
      <CustomizedDataGrid label='Resource Used' rows={[]} columns={columns} />
    </ReportWorkStep>
  )
}

export default TabResourceUsed
