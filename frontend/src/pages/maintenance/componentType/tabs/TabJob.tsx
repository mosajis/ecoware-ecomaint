import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import { useCallback, useMemo, useState } from 'react'
import { tblCompTypeJob, TypeTblCompTypeJob } from '@/core/api/generated/api'
import { GridColDef } from '@mui/x-data-grid'
import { useNavigate } from '@tanstack/react-router'
import { useDataGrid } from '@/shared/hooks/useDataGrid'

// === Columns ===
const columns: GridColDef<TypeTblCompTypeJob>[] = [
  {
    field: 'jobCode',
    headerName: 'Job Code',
    width: 100,
    valueGetter: (value, row) => row.tblJobDescription?.jobDescCode || '',
  },
  {
    field: 'jobTitle',
    headerName: 'Job Title',
    flex: 1,
    valueGetter: (value, row) => row.tblJobDescription?.jobDescTitle || '',
  },
  {
    field: 'discipline',
    headerName: 'Discipline',
    flex: 1,
    valueGetter: (value, row) => row.tblDiscipline?.name,
  },
  { field: 'frequency', headerName: 'Frequency', flex: 1 },
  {
    field: 'Period',
    headerName: 'Frequency Period',
    flex: 1,
    valueGetter: (_, row) => row.tblPeriod?.name,
  },
]

type Props = {
  selected?: number | null
  label?: string | null
}

const TabJob = ({ selected, label }: Props) => {
  // ===== Dialog State =====
  const navigate = useNavigate()

  const handleCreate = () => {
    if (!selected) return
    navigate({
      to: location.pathname + `/${selected}/job`,
    })
  }

  // === getAll callback ===
  const getAll = useCallback(() => {
    if (!selected) return Promise.resolve({ items: [] })
    return tblCompTypeJob.getAll({
      include: {
        tblJobDescription: true,
        tblDiscipline: true,
        tblPeriod: true,
      },
      filter: {
        compTypeId: selected,
      },
    })
  }, [selected])

  // === useDataGrid ===
  const { rows, loading, fetchData } = useDataGrid(
    getAll,
    tblCompTypeJob.deleteById,
    'compTypeJobId'
  )

  return (
    <>
      <CustomizedDataGrid
        label={label || 'Job'}
        rows={rows}
        columns={columns}
        loading={loading}
        showToolbar
        disableRowNumber
        getRowId={row => row.compTypeJobId}
        onRefreshClick={fetchData}
        onAddClick={handleCreate}
      />
    </>
  )
}

export default TabJob
