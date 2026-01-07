import Splitter from '@/shared/components/Splitter/Splitter'
import AppEditor from '@/shared/components/Editor'
import JobDescriptionUpsert from './JobDescriptionUpsert'
import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import { GridColDef } from '@mui/x-data-grid'
import { useCallback, useMemo, useState } from 'react'
import { dataGridActionColumn } from '@/shared/components/dataGrid/DataGridActionsColumn'
import { JobDescriptionTabs } from './JobDescriptionTabs'
import { useDataGrid } from '@/shared/hooks/useDataGrid'
import {
  tblJobDescription,
  TypeTblJobDescription,
} from '@/core/api/generated/api'

export default function PageJobDescription() {
  const [openForm, setOpenForm] = useState(false)
  const [mode, setMode] = useState<'create' | 'update'>('create')
  const [selected, setSelected] = useState<TypeTblJobDescription | null>(null)

  // === DataGrid ===
  const getAll = useCallback(() => {
    return tblJobDescription.getAll({
      include: { tblJobClass: true },
    })
  }, [])

  const { rows, loading, handleRefresh, handleDelete } = useDataGrid(
    getAll,
    tblJobDescription.deleteById,
    'jobDescId'
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
      { field: 'jobDescCode', headerName: 'Code', width: 120 },
      { field: 'jobDescTitle', headerName: 'JobTitle', flex: 2 },
      {
        field: 'jobClass',
        headerName: 'JobClass',
        flex: 1,
        valueGetter: (value, row) => row?.tblJobClass?.name,
      },
      { field: 'changeReason', headerName: 'ChangeReason', flex: 1 },
      dataGridActionColumn({ onEdit: handleEdit, onDelete: handleDelete }),
    ],
    [handleEdit, handleDelete]
  )

  const handleRowClick = (params: any) => {
    setSelected(params.row)
  }

  return (
    <>
      <Splitter initialPrimarySize='45%' resetOnDoubleClick>
        <CustomizedDataGrid
          label='Job Description'
          getRowId={row => row.jobDescId}
          loading={loading}
          disableRowNumber
          onAddClick={handleCreate}
          rows={rows}
          onRefreshClick={handleRefresh}
          columns={columns}
          showToolbar
          onRowClick={handleRowClick}
        />

        <JobDescriptionTabs
          label={selected?.jobDescTitle}
          jobDescriptionId={selected?.jobDescId}
        />
      </Splitter>

      <JobDescriptionUpsert
        open={openForm}
        mode={mode}
        recordId={selected?.jobDescId}
        onClose={() => setOpenForm(false)}
        onSuccess={() => {
          handleRefresh()
          setOpenForm(false)
        }}
      />
    </>
  )
}
