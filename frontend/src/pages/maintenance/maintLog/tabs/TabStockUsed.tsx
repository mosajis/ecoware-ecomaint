import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import { useCallback } from 'react'
import {
  tblMaintLogStocks,
  tblStockType,
  TypeTblMaintLog,
  TypeTblMaintLogStocks,
} from '@/core/api/generated/api'
import { useDataGrid } from '@/shared/hooks/useDataGrid'
import { GridColDef } from '@mui/x-data-grid'

type Props = {
  selected: TypeTblMaintLog
  label?: string
}

const TabStockUsed = (props: Props) => {
  const { selected } = props

  const getAll = useCallback(() => {
    return tblMaintLogStocks.getAll({
      include: {
        tblStockItem: {
          include: {
            tblStockType: true,
          },
        },
      },
      filter: {
        maintLogId: selected?.maintLogId,
      },
    })
  }, [selected?.maintLogId])

  // === useDataGrid ===
  const { rows, loading, handleDelete, handleRefresh } = useDataGrid(
    getAll,
    tblMaintLogStocks.deleteById,
    'maintLogStockId',
    !!selected?.maintLogId
  )

  const columns: GridColDef<TypeTblMaintLogStocks>[] = [
    { field: 'stockNo', headerName: 'Extra No', flex: 1 },
    { field: 'stockName', headerName: 'Stock Name', flex: 1 },
  ]

  return (
    <CustomizedDataGrid
      showToolbar
      loading={loading}
      label='Stock Used (not set)'
      rows={rows}
      getRowId={row => row.maintLogStockId}
      columns={columns}
    />
  )
}

export default TabStockUsed
