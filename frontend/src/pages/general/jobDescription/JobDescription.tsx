import Splitter from '@/shared/components/Splitter'
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
  const [html, setHtml] = useState('')
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
    setHtml('')
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

  // === SAVE DESCRIPTION ===
  const handleSaveDescription = async (newValue: string) => {
    if (!selected) return

    await tblJobDescription.update(selected.jobDescId, {
      jobDesc: newValue,
    })

    handleRefresh()
  }

  const handleRowClick = (params: any) => {
    setSelected(params.row)
    setHtml(params.row.jobDesc || '')
  }

  // Fix Job Description Spillter size (increase editor width)

  return (
    <>
      <Splitter
        horizontal
        initialPrimarySize='50%'
        resetOnDoubleClick
        minPrimarySize='20%'
        minSecondarySize='20%'
      >
        <Splitter
          horizontal={false}
          initialPrimarySize='50%'
          resetOnDoubleClick
          minPrimarySize='30%'
          minSecondarySize='25%'
        >
          <CustomizedDataGrid
            label='Job Description'
            getRowId={row => row.jobDescId}
            loading={loading}
            onAddClick={handleCreate}
            rows={rows}
            onRefreshClick={handleRefresh}
            columns={columns}
            showToolbar
            onRowClick={handleRowClick}
          />

          <AppEditor
            label='Description'
            autoSave
            initValue={html}
            onSave={handleSaveDescription}
          />
        </Splitter>

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
