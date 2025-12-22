import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import { useCallback } from 'react'
import { GridColDef } from '@mui/x-data-grid'
import { useDataGrid } from '@/shared/hooks/useDataGrid'
import { tblCompType, TypeTblComponentUnit } from '@/core/api/generated/api'

interface TabCompTypeProps {
  compUnitId: number | null | undefined
  label?: string | null
}

const columns: GridColDef<TypeTblComponentUnit>[] = [
  {
    field: 'CompName',
    headerName: 'Comp Name (Not Set)',
    flex: 1,
  },
  {
    field: 'compTypeNo',
    headerName: 'Comp Type No',
    width: 120,
    valueGetter: (_, row) => row.tblCompType?.compTypeNo,
  },
  {
    field: 'compQuantity',
    headerName: 'Comp Quantity (not set)',
    flex: 1,
  },
]

export default function TabCompType(props: TabCompTypeProps) {
  const { compUnitId, label } = props

  const getAll = useCallback(() => {
    return tblCompType.getAll({
      paginate: true,
      include: { tblCompType: true },
    })
  }, [])

  const { rows, loading, fetchData } = useDataGrid(
    getAll,
    tblCompType.deleteById,
    'compTypeId',
    !!compUnitId
  )

  return (
    <CustomizedDataGrid
      rows={rows}
      columns={columns}
      loading={loading}
      label={label || 'Component Type'}
      showToolbar
      onRefreshClick={fetchData}
      getRowId={row => row.compTypeId}
    />
  )
}
