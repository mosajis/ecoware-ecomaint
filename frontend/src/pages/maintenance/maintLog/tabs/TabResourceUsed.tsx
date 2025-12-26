import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import { useCallback } from 'react'
import { GridColDef } from '@mui/x-data-grid'
import { tblEmployee, TypeTblEmployee } from '@/core/api/generated/api'
import { useDataGrid } from '@/shared/hooks/useDataGrid'

const TabResourceUsed = () => {
  const getAll = useCallback(() => {
    return tblEmployee.getAll({
      include: {
        tblDiscipline: true,
      },
    })
  }, [])

  const { rows, loading } = useDataGrid(
    getAll,
    tblEmployee.deleteById,
    'employeeId'
  )

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
  ]

  return (
    <CustomizedDataGrid
      loading={loading}
      label='Resource Used'
      rows={rows}
      columns={columns}
      getRowId={row => row.employeeId}
    />
  )
}

export default TabResourceUsed
