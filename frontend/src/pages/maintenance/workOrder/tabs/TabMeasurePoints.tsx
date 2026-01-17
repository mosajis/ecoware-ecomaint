import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import CellDateTime from '@/shared/components/dataGrid/cells/CellDateTime'
import { useCallback } from 'react'
import { GridColDef } from '@mui/x-data-grid'
import { useDataGrid } from '@/shared/hooks/useDataGrid'
import {
  tblCompMeasurePoint,
  tblCompTypeMeasurePoint,
  TypeTblWorkOrder,
  type TypeTblCompMeasurePoint,
} from '@/core/api/generated/api'

interface Props {
  workOrder?: TypeTblWorkOrder
  label?: string
}

const getRowId = (row: TypeTblCompMeasurePoint) => row.compMeasurePointId

const columns: GridColDef<TypeTblCompMeasurePoint>[] = [
  {
    field: 'currentDate',
    headerName: 'Current Date',
    flex: 1,
    renderCell: ({ value }) => <CellDateTime value={value} />,
  },
  {
    field: 'currentValue',
    headerName: 'Current Value',
    flex: 1,
  },
  {
    field: 'counterTypeName',
    headerName: 'Counter Type Name',
    flex: 1,
    valueGetter: (v, row) => row?.tblCounterType?.name,
  },

  {
    field: 'unitName',
    headerName: 'Unit Name',
    flex: 1,
    valueGetter: (v, row) => row?.tblUnit?.name,
  },
  {
    field: 'unitDescription',
    headerName: 'Unit Description',
    flex: 1,
    valueGetter: (v, row) => row?.tblUnit?.description,
  },
]

const TabMeasurePoints = ({ workOrder, label }: Props) => {
  const compId = workOrder?.compId

  const getAll = useCallback(() => {
    return tblCompMeasurePoint.getAll({
      filter: {
        compId,
      },
      include: {
        tblUnit: true,
        tblCounterType: true,
      },
    })
  }, [compId])

  const { rows, loading, handleRefresh } = useDataGrid(
    getAll,
    tblCompTypeMeasurePoint.deleteById,
    'compMeasurePointId',
    !!compId
  )

  return (
    <CustomizedDataGrid
      disableAdd
      disableEdit
      disableDelete
      showToolbar={!!label}
      label={label}
      rows={rows}
      columns={columns}
      loading={loading}
      onRefreshClick={handleRefresh}
      getRowId={getRowId}
    />
  )
}

export default TabMeasurePoints
