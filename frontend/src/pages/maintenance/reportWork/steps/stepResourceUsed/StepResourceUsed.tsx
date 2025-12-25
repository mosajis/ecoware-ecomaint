import { useState, useCallback } from 'react'
import { useAtom } from 'jotai'
import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import ReportWorkStep from '../../ReportWorkStep'
import ResourceFormDialog from './StepResourceFormDialog'
import { dataGridActionColumn } from '@/shared/components/dataGrid/DataGridActionsColumn'
import { GridColDef } from '@mui/x-data-grid'
import { atomInitalData } from '../../ReportWorkAtom'
import { users } from '@/core/api/generated/api'
import { useDataGrid } from '@/shared/hooks/useDataGrid'

type TypeResourceUsed = {
  resourceId: number
  resourceName: string
  discipline: string
  timeSpent: number
}

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

  const handleEdit = (row: TypeResourceUsed) => {
    setSelectedRowId(row.resourceId)
    setMode('update')
    setOpenForm(true)
  }

  const getAll = useCallback(() => {
    return users.getAll({})
  }, [])

  const { rows, loading, handleRefresh, handleDelete } = useDataGrid(
    getAll,
    users.deleteById,
    'userId'
  )

  const handleFormSuccess = (newRow: TypeResourceUsed) => {
    setOpenForm(false)
    handleRefresh()
  }

  // === Columns ===
  const columns: GridColDef<TypeResourceUsed>[] = [
    { field: 'resourceName', headerName: 'Resource Name', flex: 1 },
    { field: 'discipline', headerName: 'Discipline', flex: 1 },
    { field: 'timeSpent', headerName: 'Time Spent', flex: 1 },
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
          label='Resource Used'
          rows={rows}
          columns={columns}
          onAddClick={handleCreate}
          getRowId={row => row.userId}
        />
      </ReportWorkStep>

      {/* === FORM === */}
      <ResourceFormDialog
        open={openForm}
        mode={mode}
        recordId={selectedRowId}
        onClose={() => setOpenForm(false)}
        onSuccess={handleFormSuccess}
      />
    </>
  )
}

export default TabResourceUsed
