import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import ReportWorkStep from '../../ReportWorkStep'

const TabStockUsed = () => {
  const columns = [
    { field: 'mescCode', headerName: 'MESC Code', flex: 1 },
    { field: 'extraNo', headerName: 'Extra No', flex: 1 },
    { field: 'partName', headerName: 'Part Name', flex: 1 },
    { field: 'qyt', headerName: 'QYT', flex: 1 },
    { field: 'unitName', headerName: 'Unit Name', flex: 1 },
    { field: 'totalMainLogs', headerName: 'Total Main Logs', flex: 1 },
  ]

  return (
    <ReportWorkStep>
      <CustomizedDataGrid label='Stock Used' rows={[]} columns={columns} />
    </ReportWorkStep>
  )
}
export default TabStockUsed
