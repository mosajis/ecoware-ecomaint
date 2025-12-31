import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import { useCallback, useMemo } from 'react'
import { GridColDef } from '@mui/x-data-grid'
import { useDataGrid } from '@/shared/hooks/useDataGrid'
import {
  tblCompTypeCounter,
  tblCompTypeJobCounter,
  TypeTblCompTypeCounter,
  TypeTblCompTypeJob,
} from '@/core/api/generated/api'
import { Box } from '@mui/material'

type Props = {
  compTypeJob?: TypeTblCompTypeJob | null
}

const TabCounter = ({ compTypeJob }: Props) => {
  // === getAll callback ===
  const getAll = useCallback(() => {
    return tblCompTypeJobCounter.getAll({
      include: {
        tblCompTypeCounter: {
          include: {
            tblCounterType: true,
          },
        },
      },
      filter: {
        compTypeJobId: compTypeJob?.compTypeJobId,
      },
    })
  }, [compTypeJob?.compTypeJobId])

  // === useDataGrid ===
  const { rows, loading, handleDelete, handleRefresh } = useDataGrid(
    getAll,
    tblCompTypeJobCounter.deleteById,
    'compTypeJobCounterId',
    !!compTypeJob?.compTypeJobId
  )

  // === Columns ===
  const columns = useMemo<GridColDef<TypeTblCompTypeCounter>[]>(
    () => [
      {
        field: 'counterType',
        headerName: 'Counter Type',
        flex: 1,
        //@ts-ignore
        valueGetter: (v, row) => row?.tblCompTypeCounter?.tblCounterType?.name,
      },
      {
        field: 'frequency',
        headerName: 'Frequency',
        flex: 1,
      },
      {
        field: 'window',
        headerName: 'Window',
        flex: 1,
      },
    ],
    []
  )

  return (
    <CustomizedDataGrid
      label={
        compTypeJob?.tblJobDescription?.jobDescTitle || 'CompType Job Counter'
      }
      rows={rows}
      columns={columns}
      loading={loading}
      showToolbar
      onRefreshClick={handleRefresh}
      getRowId={row => row.compTypeJobCounterId}
    />
  )
}

export default TabCounter
