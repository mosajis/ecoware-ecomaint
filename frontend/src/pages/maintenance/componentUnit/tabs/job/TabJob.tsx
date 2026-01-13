import CellDateTime from '@/shared/components/dataGrid/cells/CellDateTime'
import CellFrequency from '@/shared/components/dataGrid/cells/CellFrequency'
import ComponentJobUpsert from './TabJobUpsert'
import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import { useDataGrid } from '@/shared/hooks/useDataGrid'
import { useCallback, useState } from 'react'
import { GridColDef } from '@mui/x-data-grid'
import {
  tblCompJob,
  TypeTblCompJob,
  TypeTblComponentUnit,
} from '@/core/api/generated/api'
import Splitter from '@/shared/components/Splitter/Splitter'
import Tabs from './TabJobTabs'

interface Props {
  componentUnit?: TypeTblComponentUnit | null
  label?: string
}

const getRowId = (row: TypeTblCompJob) => row.compJobId

const columns: GridColDef<TypeTblCompJob>[] = [
  {
    field: 'jobCode',
    headerName: 'Code',
    width: 90,
    valueGetter: (_, row) => row.tblJobDescription?.jobDescCode,
  },
  {
    field: 'jobName',
    headerName: 'Title',
    flex: 2.5,
    valueGetter: (_, row) => row.tblJobDescription?.jobDescTitle,
  },
  {
    field: 'frequency',
    headerName: 'Frequency',
    width: 95,
    renderCell: ({ row, value }) => (
      <CellFrequency frequency={value} frequencyPeriod={row.tblPeriod} />
    ),
  },
  {
    field: 'discipline',
    headerName: 'Discipline',
    flex: 1,
    valueGetter: (_, row) => row.tblDiscipline?.name,
  },
  {
    field: 'maintClass',
    headerName: 'MaintClass',
    flex: 1,
    valueGetter: (_, row) => row.tblMaintClass?.descr,
  },
  {
    field: 'maintType',
    headerName: 'MaintType',
    flex: 1,
    valueGetter: (_, row) => row.tblMaintType?.descr,
  },
  {
    field: 'maintCause',
    headerName: 'MaintCause',
    flex: 1,
    valueGetter: (_, row) => row.tblMaintCause?.descr,
  },
  {
    field: 'priority',
    headerName: 'Priority',
    width: 75,
  },
  {
    field: 'window',
    headerName: 'Window',
    width: 75,
  },
  {
    field: 'planningMethod',
    headerName: 'Method',
    width: 85,
    valueGetter: (_, row) => (row.planningMethod ? 'Fixed' : 'Variable'),
  },
  {
    field: 'statusNone',
    headerName: 'St-None',
    width: 85,
    type: 'boolean',
  },
  {
    field: 'statusInUse',
    headerName: 'St-InUse',
    width: 85,
    type: 'boolean',
  },
  {
    field: 'statusAvailable',
    headerName: 'St-Available',
    width: 85,
    type: 'boolean',
  },
  {
    field: 'statusRepair',
    headerName: 'St-Repair',
    width: 85,
    type: 'boolean',
  },
  {
    field: 'lastDone',
    headerName: 'Last Done',
    width: 150,
    renderCell: ({ value }) => <CellDateTime value={value} />,
  },
  {
    field: 'nextDueDate',
    headerName: 'Next Due Date',
    width: 150,
    renderCell: ({ value }) => <CellDateTime value={value} />,
  },
]

const TabJob = ({ componentUnit, label }: Props) => {
  const compId = componentUnit?.compId

  const [openForm, setOpenForm] = useState(false)
  const [mode, setMode] = useState<'create' | 'update'>('create')
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null)
  const [selectedCompJob, setSelectedCompJob] = useState<TypeTblCompJob | null>(
    null
  )

  const getAll = useCallback(() => {
    return tblCompJob.getAll({
      filter: { compId },
      include: {
        tblJobDescription: true,
        tblDiscipline: true,
        tblPeriod: true,
        tblMaintCause: true,
        tblMaintClass: true,
        tblMaintType: true,
      },
    })
  }, [compId])

  const { rows, loading, handleRefresh, handleDelete } = useDataGrid(
    getAll,
    tblCompJob.deleteById,
    'compJobId',
    !!compId
  )

  /* ================= Handlers ================= */

  const handleAdd = useCallback(() => {
    setSelectedRowId(null)
    setMode('create')
    handleUpsertOpen()
  }, [])

  const handleEdit = useCallback((rowId: number) => {
    setSelectedRowId(rowId)
    setMode('update')
    handleUpsertOpen()
  }, [])

  const handleSuccess = useCallback(() => {
    setOpenForm(false)
    handleRefresh()
  }, [])

  const handleUpsertClose = useCallback(() => {
    setOpenForm(false)
  }, [])

  const handleUpsertOpen = useCallback(() => {
    setOpenForm(true)
  }, [])

  const handleRowClick = ({ row }: { row: TypeTblCompJob }) => {
    setSelectedCompJob(row)
  }
  return (
    <>
      <Splitter horizontal initialPrimarySize='65%'>
        <CustomizedDataGrid
          disableRowNumber
          label={label}
          showToolbar={!!label}
          rows={rows}
          columns={columns}
          loading={loading}
          onRowClick={handleRowClick}
          onEditClick={handleEdit}
          onDoubleClick={handleEdit}
          onDeleteClick={handleDelete}
          getRowId={getRowId}
          onRefreshClick={handleRefresh}
          onAddClick={handleAdd}
        />
        <Tabs compJob={selectedCompJob} />
      </Splitter>

      <ComponentJobUpsert
        open={openForm}
        mode={mode}
        recordId={selectedRowId}
        compId={compId!}
        onClose={handleUpsertClose}
        onSuccess={handleSuccess}
      />
    </>
  )
}

export default TabJob
