import CellDateTime from '@/shared/components/dataGrid/cells/CellDateTime'
import ComponentJobUpsert from './TabJobUpsert'
import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import { useDataGrid } from '@/shared/hooks/useDataGrid'
import { useMemo, useCallback, useState } from 'react'
import { GridColDef } from '@mui/x-data-grid'
import {
  tblCompJob,
  TypeTblCompJob,
  TypeTblComponentUnit,
} from '@/core/api/generated/api'
import { dataGridActionColumn } from '@/shared/components/dataGrid/DataGridActionsColumn'

interface TabJobProps {
  componentUnit?: TypeTblComponentUnit | null
  label?: string | null
}

const TabJob = ({ componentUnit, label }: TabJobProps) => {
  const compId = componentUnit?.compId

  const [openForm, setOpenForm] = useState(false)
  const [mode, setMode] = useState<'create' | 'update'>('create')
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null)

  /* ================= Data ================= */

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
    setOpenForm(true)
  }, [])

  const handleEdit = useCallback((row: TypeTblCompJob) => {
    setSelectedRowId(row.compJobId)
    setMode('update')
    setOpenForm(true)
  }, [])

  const handleDeleteRow = useCallback(
    async (row: TypeTblCompJob) => {
      await handleDelete(row)
    },
    [handleDelete]
  )

  const handleSuccess = useCallback(() => {
    setOpenForm(false)
    handleRefresh()
  }, [handleRefresh])

  /* ================= Columns ================= */

  const columns = useMemo<GridColDef<TypeTblCompJob>[]>(
    () => [
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
        width: 90,
      },
      {
        field: 'frequencyPeriod',
        headerName: 'Period',
        width: 70,
        valueGetter: (_, row) => row.tblPeriod?.name,
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
      dataGridActionColumn({
        onEdit: handleEdit,
        onDelete: handleDeleteRow,
      }),
    ],
    [handleEdit, handleDeleteRow]
  )

  /* ================= Render ================= */

  return (
    <>
      <CustomizedDataGrid
        label={label ?? 'Component Jobs'}
        showToolbar
        rows={rows}
        columns={columns}
        loading={loading}
        disableRowNumber
        getRowId={row => row.compJobId}
        onRefreshClick={handleRefresh}
        onAddClick={handleAdd}
        disableRowSelectionOnClick
      />

      <ComponentJobUpsert
        open={openForm}
        mode={mode}
        recordId={selectedRowId}
        compId={compId!}
        onClose={() => setOpenForm(false)}
        onSuccess={handleSuccess}
      />
    </>
  )
}

export default TabJob
