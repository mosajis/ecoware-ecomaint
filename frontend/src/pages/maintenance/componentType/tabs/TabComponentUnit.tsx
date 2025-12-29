import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import { useCallback } from 'react'
import { useDataGrid } from '@/shared/hooks/useDataGrid'
import { GridColDef } from '@mui/x-data-grid'
import {
  tblComponentUnit,
  TypeTblComponentUnit,
} from '@/core/api/generated/api'

// === Columns ===
const columns: GridColDef<TypeTblComponentUnit>[] = [
  {
    field: 'typeNo',
    headerName: 'Type No',
    width: 80,
    valueGetter: (v, row) => row?.tblCompType?.compTypeNo,
  },
  {
    field: 'compName',
    headerName: 'Comp Name',
    width: 200,
    valueGetter: (v, row) => row?.tblCompType?.compName,
  },
  {
    field: 'compNo',
    headerName: 'Comp No',
    flex: 1,
  },

  {
    field: 'location',
    headerName: 'Location',
    flex: 1,
    valueGetter: (v, row) => row.tblLocation?.name,
  },
  {
    field: 'serialNo',
    headerName: 'Serial',
    width: 100,
  },
]

type Props = {
  selected?: number | null
  label?: string
}

const TabComponentUnit = ({ selected, label }: Props) => {
  // === getAll callback ===
  const getAll = useCallback(() => {
    return tblComponentUnit.getAll({
      filter: {
        compTypeId: selected,
      },
      include: {
        tblLocation: true,
        tblCompType: true,
      },
    })
  }, [selected])

  // === useDataGrid ===
  const { rows, loading, fetchData } = useDataGrid(
    getAll,
    tblComponentUnit.deleteById,
    'compId',
    !!selected
  )

  return (
    <CustomizedDataGrid
      label={label || 'Component'}
      rows={rows}
      columns={columns}
      loading={loading}
      showToolbar
      disableRowNumber
      onRefreshClick={fetchData}
      getRowId={row => row.compId}
    />
  )
}

export default TabComponentUnit
