import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import { GridColDef } from '@mui/x-data-grid'
import { useDataGrid } from '@/shared/hooks/useDataGrid'
import { useCallback } from 'react'
import {
  tblCompMeasurePoint,
  tblCompType,
  tblUnit,
  TypeTblCompMeasurePoint,
} from '@/core/api/generated/api'
import CellDateTime from '@/shared/components/dataGrid/cells/CellDateTime'

const getRowId = (row: TypeTblCompMeasurePoint) => row.compMeasurePointId

const columns: GridColDef<TypeTblCompMeasurePoint>[] = [
  {
    field: 'compTypeNo',
    headerName: 'CompType No',
    // @ts-ignore
    valueGetter: (_, row) => row?.tblComponentUnit?.tblCompType?.compTypeNo,
  },
  {
    field: 'compType',
    headerName: 'CompType',
    flex: 1,
    // @ts-ignore
    valueGetter: (_, row) => row?.tblComponentUnit?.tblCompType?.compName,
  },
  {
    field: 'compNo',
    headerName: 'Component Name',
    flex: 1,
    valueGetter: (_, row) => row?.tblComponentUnit?.compNo,
  },
  {
    field: 'measureName',
    headerName: 'Measure Name',
    valueGetter: (_, row) => row.tblCounterType?.name,
  },
  {
    field: 'currentValue',
    headerName: 'Current Value',
  },
  {
    field: 'currentDate',
    headerName: 'Current Date',
    width: 130,
    renderCell: ({ value }) => <CellDateTime value={value} />,
  },
  {
    field: 'operationalMinValue',
    headerName: 'Min Value',
  },
  {
    field: 'setValue',
    headerName: 'Set Value',
  },
  {
    field: 'operationalMaxValue',
    headerName: 'Max Value',
  },
  {
    field: 'unitName',
    headerName: 'Unit Name',
    valueGetter: (_, row) => row.tblUnit?.name,
  },
  {
    field: 'unitDescription',
    headerName: 'Unit Description',
    valueGetter: (_, row) => row.tblUnit?.description,
  },
]

function PageMeasurePoints() {
  // === useDataGrid ===
  const getAll = useCallback(
    () =>
      tblCompMeasurePoint.getAll({
        filter: {
          tblCounterType: {
            type: 3,
          },
        },
        include: {
          tblUnit: true,
          tblCounterType: true,
          tblComponentUnit: {
            include: {
              tblCompType: true,
            },
          },
        },
      }),
    []
  )
  const { rows, loading, handleRefresh } = useDataGrid(
    getAll,
    tblCompMeasurePoint.deleteById,
    'compMeasurePointId'
  )

  return (
    <CustomizedDataGrid
      showToolbar
      disableAdd
      disableEdit
      disableDelete
      label='Measure Points'
      rows={rows}
      columns={columns}
      loading={loading}
      onRefreshClick={handleRefresh}
      getRowId={getRowId}
    />
  )
}

export default PageMeasurePoints
