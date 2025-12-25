import Box from '@mui/material/Box'
import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid' // مسیرت رو درست کن

const TabStockUsed = () => {
  const columns = [
    { field: 'stockCode', headerName: 'Stock Code', flex: 1 },
    { field: 'mescCode', headerName: 'MESC Code', flex: 1 },
    { field: 'extraNo', headerName: 'Extra No', flex: 1 },
    { field: 'stockName', headerName: 'Stock Name', flex: 1 },
    { field: 'qyt', headerName: 'QYT', flex: 1 },
  ]

  return (
    <CustomizedDataGrid
      showToolbar
      label='Stock Used (not set)'
      rows={[]}
      columns={columns}
    />
  )
}

export default TabStockUsed
