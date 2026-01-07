import Splitter from '@/shared/components/Splitter/Splitter'
import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import TabsComponent from './RoundTabs'
import { useDataGrid } from '@/shared/hooks/useDataGrid'
import { tblRound } from '@/core/api/generated/api'

const columns = [
  { field: 'roundCode', headerName: 'Round Code', flex: 1 },
  { field: 'roundTitle', headerName: 'Round Title', flex: 1 },
  { field: 'description', headerName: 'Description', flex: 1 },
  { field: 'frequency', headerName: 'Frequency', flex: 1 },
  { field: 'disiplineName', headerName: 'Disipline Name', flex: 1 },
  { field: 'lastDone', headerName: 'Last Done', flex: 1 },
  { field: 'lastDueDate', headerName: 'Last Due Date', flex: 1 },
  { field: 'lastUpdated', headerName: 'Last Updated', flex: 1 },
  { field: 'totalJobs', headerName: 'Total Jobs', flex: 1 },
  { field: 'maintTypeDes', headerName: 'Maint Type Des', flex: 1 },
  { field: 'maintCauseDes', headerName: 'Maint Cause Des', flex: 1 },
  { field: 'maintClassDes', headerName: 'Maint Class Des', flex: 1 },
  {
    field: 'reportingMethodName',
    headerName: 'Reporting Method Name',
    flex: 1,
  },
  { field: 'planningMethodName', headerName: 'Planning Method Name', flex: 1 },
]

export default function RoundPage() {
  const { rows, loading, handleRefresh, handleDelete, handleFormSuccess } =
    useDataGrid(tblRound.getAll, tblRound.deleteById, 'roundId')

  return (
    <Splitter horizontal initialPrimarySize='50%' minPrimarySize='200px'>
      <CustomizedDataGrid
        showToolbar
        loading={loading}
        label='Rounds'
        rows={rows}
        onRefreshClick={handleRefresh}
        columns={columns}
        getRowId={row => row.roundId}
      />
      <TabsComponent />
    </Splitter>
  )
}
