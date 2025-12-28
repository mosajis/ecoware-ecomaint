import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import { useCallback, useMemo } from 'react'
import { useDataGrid } from '@/shared/hooks/useDataGrid'
import { GridColDef } from '@mui/x-data-grid'
import {
  tblComponentUnit,
  TypeTblComponentUnit,
} from '@/core/api/generated/api'

type Props = {
  selected?: number | null
}

const TabComponentUnit = ({ selected }: Props) => {
  // === getAll callback ===
  const getAll = useCallback(() => {
    return tblComponentUnit.getAll({
      filter: {
        compTypeId: selected,
      },
    })
  }, [selected])

  // === useDataGrid ===
  const { rows, loading, fetchData, handleDelete } = useDataGrid(
    getAll,
    tblComponentUnit.deleteById,
    'compId'
  )

  // === Columns ===
  const columns = useMemo<GridColDef<TypeTblComponentUnit>[]>(
    () => [
      {
        field: 'compNo',
        headerName: 'Comp Name',
        flex: 1,
        valueGetter: (v, row) => row.compNo || '',
      },
      {
        field: 'compTypeId',
        headerName: 'Comp Type',
        flex: 1,
      },
      {
        field: 'location',
        headerName: 'Location',
        flex: 1,
        valueGetter: (v, row) => row.userDefText1 || '',
      },
      {
        field: 'serialNo',
        headerName: 'Serial',
        flex: 1,
        valueGetter: (v, row) => row.serialNo || '',
      },
    ],
    []
  )

  return (
    <CustomizedDataGrid
      label='Component Unit'
      rows={rows}
      columns={columns}
      loading={loading}
      showToolbar
      onRefreshClick={fetchData}
      getRowId={row => row.compId}
    />
  )
}

export default TabComponentUnit
