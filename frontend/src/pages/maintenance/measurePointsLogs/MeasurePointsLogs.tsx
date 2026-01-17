import CellDateTime from '@/shared/components/dataGrid/cells/CellDateTime'
import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import { GridColDef } from '@mui/x-data-grid'
import { useDataGrid } from '@/shared/hooks/useDataGrid'
import { useCallback } from 'react'
import {
  tblCompMeasurePointLog,
  TypeTblCompMeasurePointLog,
} from '@/core/api/generated/api'

const getRowId = (row: TypeTblCompMeasurePointLog) => row.compMeasurePointLogId

const columns: GridColDef<TypeTblCompMeasurePointLog>[] = [
  {
    field: 'compType',
    headerName: 'compType',
    flex: 1,
    valueGetter: (_, row) =>
      // @ts-ignore
      row?.tblCompMeasurePoint?.tblComponentUnit?.tblCompType?.compName,
  },
  {
    field: 'compNo',
    headerName: 'CompNo',
    flex: 1,
    // @ts-ignore
    valueGetter: (_, row) => row?.tblCompMeasurePoint?.tblComponentUnit.compNo,
  },
  {
    field: 'measureName',
    headerName: 'Measure Type',
    width: 200,
    // @ts-ignore
    valueGetter: (_, row) => row?.tblCompMeasurePoint?.tblCounterType.name,
  },
  {
    field: 'currentValue',
    headerName: 'Current Value',
    valueGetter: (_, row) => row.currentValue,
  },
  {
    field: 'currentDate',
    headerName: 'Current Date',
    width: 130,
    renderCell: ({ value }) => <CellDateTime value={value} />,
  },
  {
    field: 'changedDate',
    headerName: 'Changed Date',
    width: 130,
    renderCell: ({ value }) => <CellDateTime value={value} />,
  },
  {
    field: 'minValue',
    headerName: 'Min Value',
    width: 150,
    valueGetter: (_, row) => row?.tblCompMeasurePoint?.operationalMinValue,
  },
  {
    field: 'maxValue',
    headerName: 'Max Value',
    valueGetter: (_, row) => row?.tblCompMeasurePoint?.operationalMaxValue,
  },
  {
    field: 'unitName',
    headerName: 'Unit Name',
    valueGetter: (_, row) => row?.tblUnit?.name,
  },
  {
    field: 'unitDescription',
    headerName: 'Unit Name',
    valueGetter: (_, row) => row?.tblUnit?.description,
  },
]

export default function PageMeasurePointsLogs() {
  const getAll = useCallback(
    () =>
      tblCompMeasurePointLog.getAll({
        paginate: true,
        include: {
          tblUnit: true,
          tblCompMeasurePoint: {
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
  const { rows, loading, handleRefresh } = useDataGrid(
    getAll,
    tblCompMeasurePointLog.deleteById,
    'compMeasurePointId'
  )

  return (
    <CustomizedDataGrid
      showToolbar
      disableAdd
      disableEdit
      disableDelete
      label='Measure Points Logs'
      rows={rows}
      columns={columns}
      loading={loading}
      onRefreshClick={handleRefresh}
      getRowId={getRowId}
    />
  )
}
