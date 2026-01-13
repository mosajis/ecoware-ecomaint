import JobCounterUpsert from './TabCounterUpsert'
import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import { useCallback, useState } from 'react'
import { GridColDef } from '@mui/x-data-grid'
import { useDataGrid } from '@/shared/hooks/useDataGrid'
import {
  tblCompTypeJobCounter,
  TypeTblCompTypeJob,
  TypeTblCompTypeJobCounter,
} from '@/core/api/generated/api'

type Props = {
  compTypeJob?: TypeTblCompTypeJob
}

const getRowId = (row: TypeTblCompTypeJobCounter) => row.compTypeJobCounterId

const columns: GridColDef<TypeTblCompTypeJobCounter>[] = [
  {
    field: 'counterType',
    headerName: 'Counter Type',
    flex: 1,
    valueGetter: (_, row) =>
      // @ts-ignore
      row.tblCompTypeCounter?.tblCounterType?.name,
  },
  { field: 'frequency', headerName: 'Frequency', width: 120 },
  { field: 'window', headerName: 'Window', width: 120 },
  {
    field: 'showInAlert',
    headerName: 'Alert',
    width: 90,
    type: 'boolean',
  },
  {
    field: 'updateByFunction',
    headerName: 'By Func',
    width: 110,
    type: 'boolean',
  },
  { field: 'orderNo', headerName: 'Order', width: 80 },
]

const TabCounter = ({ compTypeJob }: Props) => {
  const compTypeJobId = compTypeJob?.compTypeJobId
  const compTypeId = compTypeJob?.compTypeId

  const [openForm, setOpenForm] = useState(false)
  const [mode, setMode] = useState<'create' | 'update'>('create')
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const label = compTypeJob?.tblJobDescription?.jobDescTitle || ''

  // === getAll ===
  const getAll = useCallback(() => {
    return tblCompTypeJobCounter.getAll({
      include: {
        tblCompTypeCounter: {
          include: {
            tblCounterType: true,
          },
        },
      },
      filter: {
        compTypeJobId,
      },
    })
  }, [compTypeJobId])

  // === useDataGrid ===
  const { rows, loading, handleDelete, handleRefresh } = useDataGrid(
    getAll,
    tblCompTypeJobCounter.deleteById,
    'compTypeJobCounterId',
    !!compTypeJobId
  )

  // === Handlers ===
  const handleCreate = () => {
    setSelectedId(null)
    setMode('create')
    handleUpsertOpen()
  }

  const handleEdit = (rowId: number) => {
    setSelectedId(rowId)
    setMode('update')
    handleUpsertOpen()
  }

  const handleUpsertClose = useCallback(() => {
    setOpenForm(false)
  }, [])

  const handleUpsertOpen = useCallback(() => {
    setOpenForm(true)
  }, [])

  return (
    <>
      <CustomizedDataGrid
        label={label}
        showToolbar={!!label}
        rows={rows}
        columns={columns}
        loading={loading}
        onRefreshClick={handleRefresh}
        onAddClick={handleCreate}
        onDeleteClick={handleDelete}
        onEditClick={handleEdit}
        onDoubleClick={handleEdit}
        getRowId={getRowId}
      />

      <JobCounterUpsert
        open={openForm}
        mode={mode}
        recordId={selectedId!}
        compTypeJobId={compTypeJobId!}
        compTypeId={compTypeId!}
        onClose={handleUpsertClose}
        onSuccess={handleRefresh}
      />
    </>
  )
}

export default TabCounter
