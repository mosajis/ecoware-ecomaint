import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import Splitter from '@/shared/components/Splitter'
import Tabs from './TabJobTabs'
import CellBoolean from '@/shared/components/dataGrid/cells/CellBoolean'
import { useCallback, useState } from 'react'
import {
  tblCompTypeJob,
  TypeTblCompType,
  TypeTblCompTypeJob,
} from '@/core/api/generated/api'
import { GridColDef } from '@mui/x-data-grid'
import { useDataGrid } from '@/shared/hooks/useDataGrid'
import { dataGridActionColumn } from '@/shared/components/dataGrid/DataGridActionsColumn'
import ComponentTypeJobUpsert from './TabJobUpsert'

// === Columns ===
type Props = {
  compType?: TypeTblCompType | null
  label?: string | null
}

const TabJob = ({ compType, label }: Props) => {
  const compTypeId = compType?.compTypeId

  const [openForm, setOpenForm] = useState(false)
  const [mode, setMode] = useState<'create' | 'update'>('create')
  const [selectedRow, setSelectedRow] = useState<TypeTblCompTypeJob | null>(
    null
  )

  const onCreate = () => {
    setSelectedRow(null)
    setMode('create')
    setOpenForm(true)
  }

  const onDelete = (row: TypeTblCompTypeJob) => {
    handleDelete(row)
    // logicTblCompTypeJob.effect(row.compTypeJobId, 2);
  }

  const onEdit = (row: TypeTblCompTypeJob) => {
    setSelectedRow(row)
    setMode('update')
    setOpenForm(true)
    // logicTblCompTypeJob.effect(row.compTypeJobId, 2);
  }

  const columns: GridColDef<TypeTblCompTypeJob>[] = [
    {
      field: 'jobCode',
      headerName: 'Code',
      width: 90,
      valueGetter: (v, row) => row?.tblJobDescription?.jobDescCode,
    },
    {
      field: 'jobName',
      headerName: 'Title',
      flex: 2.5,
      valueGetter: (v, row) => row?.tblJobDescription?.jobDescTitle,
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
      valueGetter: (v, row) => row?.tblPeriod?.name,
    },
    {
      field: 'discipline',
      headerName: 'Discipline',
      flex: 1,
      valueGetter: (_, row) => row.tblDiscipline?.name,
    },
    {
      field: 'maintClass',
      headerName: 'Mt-Class',
      flex: 1,
      valueGetter: (_, row) => row.tblMaintClass?.descr,
    },
    {
      field: 'maintType',
      headerName: 'Mt-Type',
      flex: 1,
      valueGetter: (_, row) => row.tblMaintType?.descr,
    },
    {
      field: 'maintCause',
      headerName: 'Mt-Cause',
      flex: 1,
      valueGetter: (_, row) => row.tblMaintCause?.descr,
    },

    {
      field: 'priority',
      headerName: 'Priority',
      width: 75,
      valueGetter: (_, row) => row.priority,
    },
    {
      field: 'window',
      headerName: 'Window',
      width: 75,
    },
    {
      field: 'planningMethod',
      headerName: 'Method',
      width: 75,
      valueGetter: (_, row) => (row.planningMethod ? 'Fixed' : 'Vairable'),
    },
    {
      field: 'statusNone',
      headerName: 'St-None',
      width: 85,
      renderCell: ({ row }) => <CellBoolean status={row.statusNone} />,
    },
    {
      field: 'statusInUse',
      headerName: 'St-InUse',
      width: 85,
      renderCell: ({ row }) => <CellBoolean status={row.statusInUse} />,
    },
    {
      field: 'statusAvailable',
      headerName: 'St-Available',
      width: 85,
      renderCell: ({ row }) => <CellBoolean status={row.statusAvailable} />,
    },
    {
      field: 'statusRepair',
      headerName: 'St-Repair',
      width: 85,
      renderCell: ({ row }) => <CellBoolean status={row.statusRepair} />,
    },

    dataGridActionColumn({
      onEdit: onEdit,
      onDelete: onDelete,
    }),
  ]

  const getAll = useCallback(() => {
    return tblCompTypeJob.getAll({
      include: {
        tblPeriod: true,
        tblJobDescription: true,
        tblDiscipline: true,
        tblMaintClass: true,
        tblMaintType: true,
        tblMaintCause: true,
      },
      filter: { compTypeId },
    })
  }, [compTypeId])

  // ===== DataGrid =====
  const { rows, loading, fetchData, handleRefresh, handleDelete } = useDataGrid(
    getAll,
    tblCompTypeJob.deleteById,
    'compTypeJobId',
    !!compTypeId
  )

  // ===== Row Click =====
  const handleRowClick = ({ row }: { row: TypeTblCompTypeJob }) => {
    setSelectedRow(row)
  }

  return (
    <>
      <Splitter horizontal initialPrimarySize='65%'>
        <CustomizedDataGrid
          label={label || 'Job'}
          rows={rows}
          columns={columns}
          loading={loading}
          showToolbar
          disableRowNumber
          getRowId={row => row.compTypeJobId}
          onRefreshClick={handleRefresh}
          onAddClick={onCreate}
          onRowClick={handleRowClick}
        />

        <Tabs compTypeJob={selectedRow} />
      </Splitter>

      <ComponentTypeJobUpsert
        open={openForm}
        mode={mode}
        recordId={selectedRow?.compTypeJobId}
        compType={{
          compName: compType?.compName || '',
          compTypeId: compType?.compTypeId || 0,
        }}
        onClose={() => setOpenForm(false)}
        onSuccess={handleRefresh}
      />
    </>
  )
}

export default TabJob
