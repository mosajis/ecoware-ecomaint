import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import { useDataGrid } from '@/shared/hooks/useDataGrid'
import { GridColDef } from '@mui/x-data-grid'
import {
  tblFailureReports,
  TypeTblComponentUnit,
  TypeTblFailureReports,
} from '@/core/api/generated/api'
import { useCallback } from 'react'
import CellDateTime from '@/shared/components/dataGrid/cells/CellDateTime'

const getRowId = (row: TypeTblFailureReports) => row.failureReportId

const columns: GridColDef<TypeTblFailureReports>[] = [
  {
    field: 'failureNumber',
    headerName: 'Number',
    width: 80,
  },
  {
    field: 'compNo',
    headerName: 'Comp No',
    flex: 1,
    valueGetter: (_, row) => row.tblComponentUnit?.compNo,
  },
  {
    field: 'failureReportDate',
    headerName: 'Failure Date',
    width: 130,
    renderCell: ({ value }) => <CellDateTime value={value} />,
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
    headerName: 'Discipline',
    width: 110,
    valueGetter: (_, row) => row.tblDiscipline?.name,
  },
  {
    field: 'lastupdate',
    headerName: 'Last Updated',
    width: 130,
    renderCell: ({ value }) => <CellDateTime value={value} />,
  },
  {
    field: 'loggedBy',
    headerName: 'Logged By',
    flex: 1,
    valueGetter: (_, row) =>
      row.tblUsersTblFailureReportsLoggedByTotblUsers?.uName,
  },
  {
    field: 'approvedBy',
    headerName: 'Approved By',
    flex: 1,
    valueGetter: (_, row) =>
      row.tblUsersTblFailureReportsApprovedbyTotblUsers?.uName,
  },
  {
    field: 'closedBy',
    headerName: 'Closed By',
    flex: 1,
    valueGetter: (_, row) =>
      row.tblUsersTblFailureReportsClosedByTotblUsers?.uName,
  },
  {
    field: 'closedDateTime',
    headerName: 'Closed Date',
    width: 130,
    renderCell: ({ value }) => <CellDateTime value={value} />,
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
      include: {
        tblComponentUnit: true,
        tblDiscipline: true,
        tblUsersTblFailureReportsLoggedByTotblUsers: true,
        tblUsersTblFailureReportsApprovedbyTotblUsers: true,
        tblUsersTblFailureReportsClosedByTotblUsers: true,
      },
      // filter: { compId },
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
