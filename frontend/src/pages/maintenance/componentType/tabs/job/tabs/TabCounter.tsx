import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import { useCallback, useMemo } from 'react'
import { GridColDef } from '@mui/x-data-grid'
import { useDataGrid } from '@/shared/hooks/useDataGrid'
import {
  tblCompTypeCounter,
  TypeTblCompTypeCounter,
  TypeTblCompTypeJob,
} from '@/core/api/generated/api'

type Props = {
  compTypeJob?: TypeTblCompTypeJob | null
}

const TabCounter = ({ compTypeJob }: Props) => {
  // === getAll callback ===
  const getAll = useCallback(() => {
    return tblCompTypeCounter.getAll({
      include: {
        tblCounterType: true,
        tblCompTypeJobCounters: true,
      },
      filter: {
        compTypeId: compTypeJob?.compTypeId,
      },
    })
  }, [compTypeJob?.compTypeId])

  // === useDataGrid ===
  const { rows, loading, handleDelete, handleRefresh } = useDataGrid(
    getAll,
    tblCompTypeCounter.deleteById,
    'compTypeCounterId',
    !!compTypeJob?.compTypeJobId
  )

  // === Columns ===
  const columns = useMemo<GridColDef<TypeTblCompTypeCounter>[]>(
    () => [
      {
        field: 'counterType',
        headerName: 'Counter Type',
        flex: 1,
        valueGetter: (v, row) => row.tblCounterType?.name || '',
      },
    ],
    []
  )

  return (
    <CustomizedDataGrid
      label='Counter'
      rows={rows}
      columns={columns}
      loading={loading}
      showToolbar
      onRefreshClick={handleRefresh}
      getRowId={row => row.compTypeJobId}
    />
  )
}

export default TabCounter
