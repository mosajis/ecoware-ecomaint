import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import Splitter from '@/shared/components/Splitter/Splitter'
import Tabs from './TabJobTabs'
import ComponentTypeJobUpsert from './TabJobUpsert'
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges'
import ConfirmDialog from '@/shared/components/ConfirmDialog'
import CellFrequency from '@/shared/components/dataGrid/cells/CellFrequency'
import { toast } from 'sonner'
import { GridColDef } from '@mui/x-data-grid'
import { useDataGrid } from '@/shared/hooks/useDataGrid'
import { logicTblCompTypeJob } from './TabJobEffect'
import { useCallback, useState } from 'react'
import {
  tblCompTypeJob,
  TypeTblCompType,
  TypeTblCompTypeJob,
} from '@/core/api/generated/api'

// === Columns ===
type Props = {
  compType?: TypeTblCompType
  label?: string
}

const getRowId = (row: TypeTblCompTypeJob) => row.compTypeJobId

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
]

const TabJob = ({ compType, label }: Props) => {
  const compTypeId = compType?.compTypeId

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [effectJobId, setEffectJobId] = useState<number | null>(null)
  const [effectOperation, setEffectOperation] = useState<0 | 1 | 2 | null>(null)

  const [openForm, setOpenForm] = useState(false)
  const [mode, setMode] = useState<'create' | 'update'>('create')
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null)
  const [selectedRow, setSelectedRow] = useState<TypeTblCompTypeJob | null>(
    null
  )

  const handleCreate = () => {
    setSelectedRowId(null)
    setMode('create')
    handleUpsertOpen()
  }

  const handleEdit = (rowId: number) => {
    setSelectedRowId(rowId)
    setMode('update')
    handleUpsertOpen()
  }

  const handleUpsertClose = useCallback(() => {
    setOpenForm(false)
  }, [])

  const handleUpsertOpen = useCallback(() => {
    setOpenForm(true)
  }, [])

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

  const { rows, loading, handleRefresh, handleDelete } = useDataGrid(
    getAll,
    tblCompTypeJob.deleteById,
    'compTypeJobId',
    !!compTypeId
  )

  const handleRowClick = ({ row }: { row: TypeTblCompTypeJob }) => {
    setSelectedRow(row)
  }

  const handleSuccess = (
    data: TypeTblCompTypeJob,
    isDelete: boolean = false
  ) => {
    setEffectJobId(data.compTypeJobId)
    setEffectOperation(isDelete ? 2 : mode === 'create' ? 0 : 1)

    openConfirmDialog()
  }

  const openConfirmDialog = () => {
    setConfirmOpen(true)
  }

  const closeConfirmDialog = () => {
    setConfirmOpen(false)
    handleRefresh()
  }

  const handleApplyEffect = async () => {
    if (!effectJobId || effectOperation === null) return

    try {
      await logicTblCompTypeJob.effect(effectJobId, effectOperation)
      closeConfirmDialog()
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          'Failed to apply changes to related components'
      )
      throw err
    }
  }

  return (
    <>
      <Splitter horizontal initialPrimarySize='65%'>
        <CustomizedDataGrid
          disableRowNumber
          showToolbar={!!label}
          label={label}
          rows={rows}
          columns={columns}
          loading={loading}
          getRowId={getRowId}
          onRefreshClick={handleRefresh}
          onAddClick={handleCreate}
          onEditClick={handleEdit}
          onDoubleClick={handleEdit}
          onRowClick={handleRowClick}
        />

        <Tabs compTypeJob={selectedRow!} />
      </Splitter>

      <ComponentTypeJobUpsert
        open={openForm}
        mode={mode}
        recordId={selectedRowId}
        compType={compType as any}
        onClose={handleUpsertClose}
        onSuccess={handleSuccess}
      />
      <ConfirmDialog
        open={confirmOpen}
        icon={
          <PublishedWithChangesIcon
            sx={{
              fontSize: '3rem',
            }}
          />
        }
        title='Apply Changes'
        message='Are you sure apply all changes to related components?'
        confirmText='Yes'
        cancelText='No'
        confirmColor='primary'
        onConfirm={handleApplyEffect}
        onCancel={closeConfirmDialog}
      />
    </>
  )
}

export default TabJob
