import JobCounterUpsert from './TabCounterUpsert'
import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import { useCallback, useMemo, useState } from 'react'
import { GridColDef } from '@mui/x-data-grid'
import { dataGridActionColumn } from '@/shared/components/dataGrid/DataGridActionsColumn'
import { useDataGrid } from '@/shared/hooks/useDataGrid'
import {
  tblCompTypeJobCounter,
  TypeTblCompTypeJob,
  TypeTblCompTypeJobCounter,
} from '@/core/api/generated/api'

type Props = {
  compTypeJob?: TypeTblCompTypeJob | null
}

const TabCounter = ({ compTypeJob }: Props) => {
  const compTypeJobId = compTypeJob?.compTypeJobId
  const compTypeId = compTypeJob?.compTypeId

  const [openForm, setOpenForm] = useState(false)
  const [mode, setMode] = useState<'create' | 'update'>('create')
  const [selectedId, setSelectedId] = useState<number | null>(null)

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
  const { rows, loading, handleDelete, handleRefresh, handleFormSuccess } =
    useDataGrid(
      getAll,
      tblCompTypeJobCounter.deleteById,
      'compTypeJobCounterId',
      !!compTypeJobId
    )

  // === Handlers ===
  const handleCreate = () => {
    setSelectedId(null)
    setMode('create')
    setOpenForm(true)
  }

  const handleEdit = (row: TypeTblCompTypeJobCounter) => {
    setSelectedId(row.compTypeJobCounterId)
    setMode('update')
    setOpenForm(true)
  }

  // === Columns ===
  const columns = useMemo<GridColDef<TypeTblCompTypeJobCounter>[]>(
    () => [
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
      dataGridActionColumn({
        onEdit: handleEdit,
        onDelete: handleDelete,
      }),
    ],
    [handleDelete]
  )

  return (
    <>
      <CustomizedDataGrid
        label={
          compTypeJob?.tblJobDescription?.jobDescTitle || 'CompType Job Counter'
        }
        rows={rows}
        columns={columns}
        loading={loading}
        showToolbar
        disableRowSelectionOnClick
        onRefreshClick={handleRefresh}
        onAddClick={handleCreate}
        getRowId={row => row.compTypeJobCounterId}
      />

      {/* === UPSERT === */}
      {compTypeJobId && compTypeId && (
        <JobCounterUpsert
          open={openForm}
          mode={mode}
          recordId={selectedId}
          compTypeJob={compTypeJob}
          compTypeJobId={compTypeJobId}
          compTypeId={compTypeId}
          onClose={() => setOpenForm(false)}
          onSuccess={handleRefresh}
        />
      )}
    </>
  )
}

export default TabCounter
