import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import ReportWorkStep from '../../ReportWorkStep'
import StepResourceUsedUpsert from './StepResourceUsedUpsert'
import { useState, useCallback } from 'react'
import { useAtom } from 'jotai'
import { dataGridActionColumn } from '@/shared/components/dataGrid/DataGridActionsColumn'
import { GridColDef } from '@mui/x-data-grid'
import { atomInitalData } from '../../ReportWorkAtom'
import {
  tblDiscipline,
  tblEmployee,
  TypeTblEmployee,
  users,
} from '@/core/api/generated/api'
import { useDataGrid } from '@/shared/hooks/useDataGrid'

const TabResourceUsed = () => {
  const [initData] = useAtom(atomInitalData)
  const [openForm, setOpenForm] = useState(false)
  const [mode, setMode] = useState<'create' | 'update'>('create')
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null)

  // === Handlers ===
  const handleCreate = () => {
    setSelectedRowId(null)
    setMode('create')
    setOpenForm(true)
  }

  const handleEdit = (row: TypeTblEmployee) => {
    setSelectedRowId(row.employeeId)
    setMode('update')
    setOpenForm(true)
  }

  const getAll = useCallback(() => {
    return tblEmployee.getAll({
      include: { tblDiscipline: true },
    })
  }, [])

  const { rows, loading, handleRefresh, handleDelete } = useDataGrid(
    getAll,
    tblEmployee.deleteById,
    'employeeId'
  )

  const handleFormSuccess = (newRow: TypeTblEmployee) => {
    setOpenForm(false)
    handleRefresh()
  }

  // === Columns ===
  const columns: GridColDef<TypeTblEmployee>[] = [
    {
      field: 'lastName',
      headerName: 'Resource Name',
      flex: 1,
      valueGetter: (_, row) => `${row.firstName} ${row.lastName}`,
    },
    {
      field: 'discipline',
      headerName: 'Discipline',
      flex: 1,
      valueGetter: (_, row) => row.tblDiscipline?.name,
    },
    { field: 'timeSpent', headerName: 'Time Spent (not set)', flex: 1 },
    dataGridActionColumn({
      onEdit: handleEdit,
      onDelete: handleDelete,
    }),
  ]

  const handleNext = (goNext: () => void) => {
    goNext()
  }

  return (
    <>
      <ReportWorkStep onNext={handleNext}>
        <CustomizedDataGrid
          loading={loading}
          showToolbar
          onRefreshClick={handleRefresh}
          label='Resource Used'
          rows={rows}
          columns={columns}
          onAddClick={handleCreate}
          getRowId={row => row.employeeId}
        />
        <StepResourceUsedUpsert
          open={openForm}
          mode={mode}
          recordId={selectedRowId}
          onClose={() => setOpenForm(false)}
          // onSuccess={handleFormSuccess}
          onSuccess={() => {}}
        />
      </ReportWorkStep>

      {/* === FORM === */}
    </>
  )
}

export default TabResourceUsed
