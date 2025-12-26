import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import CellBoolean from '@/shared/components/dataGrid/cells/CellBoolean'
import { GridColDef } from '@mui/x-data-grid'
import { useDataGrid } from '@/shared/hooks/useDataGrid'
import { useCallback } from 'react'
import {
  tblMaintLogStocks,
  TypeTblMaintLogStocks,
} from '@/core/api/generated/api'

export default function PageStockUsed() {
  const getAll = useCallback(() => {
    return tblMaintLogStocks.getAll({
      include: {
        tblMaintLog: true,
        tblStockItem: true,
      },
    })
  }, [])

  const { rows, loading, handleRefresh, handleDelete } = useDataGrid(
    getAll,
    tblMaintLogStocks.deleteById,
    'maintLogStockId'
  )

  // === Columns ===
  const columns: GridColDef<TypeTblMaintLogStocks>[] = [
    {
      field: 'tblMaintLog',
      headerName: 'Component',
      flex: 1,
      renderCell: params => params.row.tblMaintLog?.compId ?? '-',
    },
    {
      field: 'jobCode',
      headerName: 'Job Code',
      width: 120,
      renderCell: params => params.row.tblMaintLog?.jobDescId ?? '-',
    },
    {
      field: 'jobName',
      headerName: 'Job Name',
      flex: 1,
      renderCell: params => params.row.tblMaintLog?.jobDescId ?? '-',
    },
    {
      field: 'dateDone',
      headerName: 'Date Done',
      width: 150,
      type: 'dateTime',
      renderCell: params => {
        const date = params.row.tblMaintLog?.lastupdate
        if (date) {
          return new Date(date).toLocaleDateString()
        }
        return '-'
      },
    },
    {
      field: 'discipline',
      headerName: 'Discipline',
      width: 120,
      renderCell: params => params.row.tblMaintLog?.maintClassId ?? '-',
    },
    {
      field: 'reportedBy',
      headerName: 'Reported By',
      width: 120,
      renderCell: params => params.row.tblMaintLog?.userId ?? '-',
    },
    {
      field: 'followStatus',
      headerName: 'Follow Status',
      width: 120,
      renderCell: params => params.row.tblMaintLog?.roundId ?? '-',
    },
    {
      field: 'maintClass',
      headerName: 'Maint Class',
      width: 120,
      renderCell: params => params.row.tblMaintLog?.maintClassId ?? '-',
    },
    {
      field: 'downTime',
      headerName: 'Down Time',
      width: 120,
      type: 'number',
      renderCell: params => params.row.tblMaintLog?.totalDuration ?? '-',
    },
    {
      field: 'isUnplanned',
      headerName: 'Is Unplanned',
      width: 120,
      type: 'boolean',
      renderCell: params => {
        const value = params.row.tblMaintLog?.unexpected
        return <CellBoolean status={value} />
      },
    },
    {
      field: 'stockCount',
      headerName: 'Stock Count',
      width: 120,
      type: 'number',
    },
  ]

  return (
    <CustomizedDataGrid
      showToolbar
      label='Maintenance Log Stocks'
      loading={loading}
      rows={rows}
      columns={columns}
      onRefreshClick={handleRefresh}
      getRowId={row => row.maintLogStockId}
    />
  )
}
