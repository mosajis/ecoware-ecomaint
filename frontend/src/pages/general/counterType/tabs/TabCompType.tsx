import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import { GridColDef } from '@mui/x-data-grid'
import { useDataGrid } from '@/shared/hooks/useDataGrid'
import { useCallback } from 'react'
import {
  tblCompTypeCounter,
  TypeTblCompTypeCounter,
} from '@/core/api/generated/api'

interface TabCompTypeCounterProps {
  counterTypeId: number | null | undefined
  label?: string
}

const getRowId = (row: TypeTblCompTypeCounter) => row.compTypeCounterId

const columns: GridColDef<TypeTblCompTypeCounter>[] = [
  {
    field: 'code',
    headerName: 'Code',
    width: 120,
    valueGetter: (_, row) => row.tblCompType?.compTypeNo,
  },
  {
    field: 'name',
    headerName: 'Name',
    flex: 1,
    valueGetter: (_, row) => row?.tblCompType?.compName,
  },
]

export default function TabCompTypeCounter(props: TabCompTypeCounterProps) {
  const { counterTypeId, label } = props

  const getAll = useCallback(() => {
    return tblCompTypeCounter.getAll({
      filter: { counterTypeId },
      include: { tblCompType: true },
    })
  }, [counterTypeId])

  const { rows, loading, fetchData } = useDataGrid(
    getAll,
    tblCompTypeCounter.deleteById,
    'compTypeCounterId',
    !!counterTypeId
  )

  return (
    <CustomizedDataGrid
      disableEdit
      disableDelete
      disableRowSelectionOnClick
      rows={rows}
      columns={columns}
      loading={loading}
      label={label}
      showToolbar={!!label}
      onRefreshClick={fetchData}
      getRowId={getRowId}
    />
  )
}
