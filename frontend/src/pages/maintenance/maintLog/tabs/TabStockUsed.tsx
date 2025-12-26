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
  const { selected, label } = props

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
    {
      field: 'stockNo',
      headerName: 'Extra No',
      width: 100,
      // @ts-ignore
      valueGetter: (_, row) => row.tblStockItem.tblStockType.no,
    },
    {
      field: 'stockName',
      headerName: 'Stock Name',
      flex: 1,
      // @ts-ignore
      valueGetter: (_, row) => row.tblStockItem.tblStockType.name,
    },
  ]

  return (
    <CustomizedDataGrid
      showToolbar
      loading={loading}
      label={label || 'Stock Used'}
      rows={rows}
      getRowId={row => row.maintLogStockId}
      columns={columns}
    />
  )
}

export default TabStockUsed
