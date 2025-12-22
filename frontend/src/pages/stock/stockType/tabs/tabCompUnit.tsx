import React, { useCallback } from 'react'
import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import {
  tblComponentUnit,
  tblCompTypeCounter,
  TypeTblComponentUnit,
  TypeTblCompTypeCounter,
} from '@/core/api/generated/api'
import { GridColDef } from '@mui/x-data-grid'
import { useDataGrid } from '@/shared/hooks/useDataGrid'

interface TabCompUnitProps {
  compUnitId: number | null | undefined
  label?: string | null
}

const columns: GridColDef<TypeTblComponentUnit>[] = [
  {
    field: 'compTypeNo',
    headerName: 'Comp Type No',
    width: 120,
    valueGetter: (_, row) => row.tblCompType?.compTypeNo,
  },
  {
    field: 'compNo',
    headerName: 'Comp No',
    flex: 1,
    valueGetter: (_, row) => row.compNo,
  },
  {
    field: 'CompName',
    headerName: 'Comp Name (Not Set)',
    flex: 1,
  },
  {
    field: 'compQuantity',
    headerName: 'Comp Quantity (not set)',
    flex: 1,
  },
  {
    field: 'locationName',
    headerName: 'Location Name (not set)',
    flex: 1,
  },
]

export default function TabCompUnit(props: TabCompUnitProps) {
  const { compUnitId, label } = props

  const getAll = useCallback(() => {
    return tblComponentUnit.getAll({
      paginate: true,
      include: { tblCompType: true },
    })
  }, [])

  const { rows, loading, fetchData } = useDataGrid(
    getAll,
    tblComponentUnit.deleteById,
    'compId',
    !!compUnitId
  )

  return (
    <CustomizedDataGrid
      rows={rows}
      columns={columns}
      loading={loading}
      label={label || 'Component Unit'}
      showToolbar
      onRefreshClick={fetchData}
      getRowId={row => row.compUnitId}
    />
  )
}
