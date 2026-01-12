import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import { useDataGrid } from '@/shared/hooks/useDataGrid'
import { GridColDef } from '@mui/x-data-grid'
import {
  tblFailureReports,
  TypeTblComponentUnit,
  TypeTblFailureReports,
} from '@/core/api/generated/api'
import { useCallback } from 'react'

const getRowId = (row: TypeTblFailureReports) => row.failureReportId

const columns: GridColDef<TypeTblFailureReports>[] = [
  {
    field: 'number',
    headerName: 'Number',
    width: 120,
  },
  {
    field: 'compNo',
    headerName: 'Comp No',
    width: 130,
  },
  {
    field: 'failureDate',
    headerName: 'Failure Date',
    width: 150,
  },
  {
    field: 'title',
    headerName: 'Title',
    flex: 1,
  },
  {
    field: 'totalWait',
    headerName: 'Total Wait',
    width: 140,
  },
  {
    field: 'discName',
    headerName: 'Disc Name',
    width: 150,
  },
  {
    field: 'lastUpdated',
    headerName: 'Last Updated',
    width: 160,
  },
  {
    field: 'loggedBy',
    headerName: 'Logged By',
    width: 150,
  },
  {
    field: 'approvedBy',
    headerName: 'Approved By',
    width: 150,
  },
  {
    field: 'closedBy',
    headerName: 'Closed By',
    width: 150,
  },
  {
    field: 'closedDate',
    headerName: 'Closed Date',
    width: 150,
  },
]

interface TabFailureReportProps {
  componentUnit?: TypeTblComponentUnit | null
  label?: string
}

const TabFailureReport = ({ componentUnit, label }: TabFailureReportProps) => {
  const compId = componentUnit?.compId

  const getAll = useCallback(() => {
    return tblFailureReports.getAll({
      filter: { compId },
    })
  }, [compId])

  const { rows, loading, handleRefresh } = useDataGrid(
    getAll,
    tblFailureReports.getById,
    'failureReportId',
    !!compId
  )

  return (
    <CustomizedDataGrid
      disableAdd
      disableEdit
      disableDelete
      label={label}
      showToolbar={!!label}
      rows={rows}
      columns={columns}
      loading={loading}
      onRefreshClick={handleRefresh}
      getRowId={getRowId}
    />
  )
}

export default TabFailureReport
