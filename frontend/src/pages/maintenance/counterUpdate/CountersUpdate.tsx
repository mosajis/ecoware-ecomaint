import Splitter from '@/shared/components/Splitter/Splitter'
import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import { GridColDef } from '@mui/x-data-grid'
import { useCallback, useMemo, useState } from 'react'
import { dataGridActionColumn } from '@/shared/components/dataGrid/DataGridActionsColumn'
import { useDataGrid } from '@/shared/hooks/useDataGrid'
import { tblCounterType, TypeTblJobDescription } from '@/core/api/generated/api'

export default function PageCounterUpdate() {
  const [openForm, setOpenForm] = useState(false)
  const [mode, setMode] = useState<'create' | 'update'>('create')
  const [selected, setSelected] = useState<TypeTblJobDescription | null>(null)

  // === DataGrid ===
  const getAll = useCallback(() => {
    return tblCounterType.getAll({
      include: { tblJobClass: true },
    })
  }, [])

  const { rows, loading, handleRefresh, handleDelete } = useDataGrid(
    getAll,
    tblCounterType.deleteById,
    'counterTypeId'
  )

  // === Handlers ===
  const handleCreate = useCallback(() => {
    setSelected(null)
    setMode('create')
    setOpenForm(true)
  }, [])

  const handleEdit = useCallback((row: TypeTblJobDescription) => {
    setSelected(row)
    setMode('update')
    setOpenForm(true)
  }, [])

  // === Columns ===
  const columns: GridColDef<TypeTblJobDescription>[] = useMemo(
    () => [
      { field: 'jobDescCode', headerName: 'Component Number', width: 120 },
      { field: 'jobDescTitle', headerName: 'CompType Name', flex: 2 },
      {
        field: 'jobClass',
        headerName: 'Counter Type',
        flex: 1,
        valueGetter: (value, row) => row?.tblJobClass?.name,
      },
      { field: 'changeReason', headerName: 'Start Date', flex: 1 },
      { field: 'changeReason', headerName: 'Start Value', flex: 1 },

      { field: 'changeReason', headerName: 'Currnet Date', flex: 1 },
      { field: 'changeReason', headerName: 'Currnet Value', flex: 1 },
      dataGridActionColumn({ onEdit: handleEdit, onDelete: handleDelete }),
    ],
    [handleEdit, handleDelete]
  )

  // === SAVE DESCRIPTION ===
  const handleSave = async (newValue: string) => {
    // handleRefresh()
  }

  const handleRowClick = (params: any) => {
    setSelected(params.row)
  }

  return (
    <>
      <Splitter
        horizontal
        initialPrimarySize='70%'
        resetOnDoubleClick
        minPrimarySize='20%'
        minSecondarySize='20%'
      >
        <CustomizedDataGrid
          label='Counters Update'
          getRowId={row => row.jobDescId}
          loading={loading}
          onAddClick={handleCreate}
          rows={rows}
          onRefreshClick={handleRefresh}
          columns={columns}
          showToolbar
          onRowClick={handleRowClick}
        />

        <CustomizedDataGrid
          label='Counters Update'
          getRowId={row => row.jobDescId}
          loading={loading}
          onAddClick={handleCreate}
          rows={rows}
          onRefreshClick={handleRefresh}
          columns={columns}
          showToolbar
          onRowClick={handleRowClick}
        />
      </Splitter>
    </>
  )
}
