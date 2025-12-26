import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import { useDataGrid } from '@/shared/hooks/useDataGrid'
import { useCallback } from 'react'
import { GridColDef } from '@mui/x-data-grid'
import {
  tblLogDiscipline,
  TypeTblLogDiscipline,
  TypeTblMaintLog,
} from '@/core/api/generated/api'

type Props = {
  selected: TypeTblMaintLog
  label?: string
}

const TabResourceUsed = (props: Props) => {
  const { selected, label } = props

  const getAll = useCallback(() => {
    return tblLogDiscipline.getAll({
      filter: {
        maintLogId: selected?.maintLogId,
      },
      include: {
        tblDiscipline: true,
        tblEmployee: true,
      },
    })
  }, [selected?.maintLogId])

  const { rows, loading } = useDataGrid(
    getAll,
    tblLogDiscipline.deleteById,
    'logDiscId',
    !!selected?.maintLogId
  )

  // === Columns ===
  const columns: GridColDef<TypeTblLogDiscipline>[] = [
    {
      field: 'lastName',
      headerName: 'Resource Name',
      flex: 1,
      valueGetter: (_, row) =>
        `${row.tblEmployee?.firstName} ${row.tblEmployee?.lastName}`,
    },
    {
      field: 'discipline',
      headerName: 'Discipline',
      flex: 1,
      valueGetter: (_, row) => row.tblDiscipline?.name,
    },
    { field: 'timeSpent', headerName: 'Time Spent', flex: 1 },
  ]

  return (
    <CustomizedDataGrid
      loading={loading}
      label={label || 'Resource Used'}
      rows={rows}
      columns={columns}
      getRowId={row => row.employeeId}
    />
  )
}

export default TabResourceUsed
