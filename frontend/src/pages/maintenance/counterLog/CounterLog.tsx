import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import { useCallback, useMemo } from 'react'
import { GridColDef } from '@mui/x-data-grid'
import { useDataGrid } from '@/shared/hooks/useDataGrid'
import {
  tblCompCounter,
  tblCompCounterLog,
  tblComponentUnit,
  TypeTblCompCounterLog,
} from '@/core/api/generated/api'
import CellDateTime from '@/shared/components/dataGrid/cells/CellDateTime'

const getRowId = (row: TypeTblCompCounterLog) => row.compCounterLogId

const columns: GridColDef<TypeTblCompCounterLog>[] = [
  {
    field: 'component',
    headerName: 'Component',
    flex: 1,
    // @ts-ignore
    valueGetter: (_, row) => row?.tblCompCounter?.tblComponentUnit?.compNo,
  },
  {
    field: 'componentType',
    headerName: 'Component Type',
    flex: 1,
    valueGetter: (_, row) =>
      // @ts-ignore
      row?.tblCompCounter?.tblComponentUnit?.tblCompType?.compName,
  },
  {
    field: 'counterName',
    headerName: 'Counter Name',
    flex: 1,
    // @ts-ignore
    valueGetter: (_, row) => row?.tblCompCounter?.tblCounterType?.name,
  },
  {
    field: 'startDate',
    headerName: 'Start Date',
    width: 130,
    renderCell: ({ value }) => <CellDateTime value={value} />,
  },
  {
    field: 'startValue',
    headerName: 'Start Value',
    width: 120,
    valueGetter: (_, row) => row.startValue,
  },
  {
    field: 'currentDate',
    headerName: 'Current Date',
    width: 130,
    renderCell: ({ value }) => <CellDateTime value={value} />,
  },
  {
    field: 'currentValue',
    headerName: 'Current Value',
    width: 120,
    valueGetter: (_, row) => row.currentValue,
  },
]

export default function PageCounterLog() {
  const getAll = useCallback(
    () =>
      tblCompCounterLog.getAll({
        include: {
          tblCompCounter: {
            include: {
              tblCounterType: true,
              tblComponentUnit: {
                include: {
                  tblCompType: true,
                },
              },
            },
          },
        },
      }),
    []
  )
  // === useDataGrid ===
  const { rows, loading, handleRefresh } = useDataGrid<TypeTblCompCounterLog>(
    getAll,
    tblCompCounterLog.deleteById,
    'compCounterLogId'
  )

  // === Columns ===

  return (
    <CustomizedDataGrid
      showToolbar
      disableAdd
      disableDelete
      disableEdit
      label='Counter Logs'
      rows={rows}
      columns={columns}
      loading={loading}
      onRefreshClick={handleRefresh}
      getRowId={getRowId}
    />
  )
}
