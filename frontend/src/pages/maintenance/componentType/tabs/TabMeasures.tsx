import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import { useCallback, useMemo } from 'react'
import { GridColDef } from '@mui/x-data-grid'
import { useDataGrid } from '@/shared/hooks/useDataGrid'
import {
  tblCompTypeMeasurePoint,
  TypeTblCompType,
  type TypeTblCompTypeMeasurePoint,
} from '@/core/api/generated/api'

type Props = {
  compType?: TypeTblCompType | null
  label?: string
}

const TabMeasuresPage = ({ compType, label }: Props) => {
  const compTypeId = compType?.compTypeId
  // === getAll callback ===
  const getAll = useCallback(() => {
    return tblCompTypeMeasurePoint.getAll({
      filter: {
        compTypeId: compTypeId,
      },
      include: {
        tblUnit: true,
        tblCounterType: true,
      },
    })
  }, [compTypeId])

  // === useDataGrid ===
  const { rows, loading, fetchData, handleDelete } = useDataGrid(
    getAll,
    tblCompTypeMeasurePoint.deleteById,
    'compTypeMeasurePointId',
    !!compTypeId
  )

  // === Columns ===
  const columns = useMemo<GridColDef<TypeTblCompTypeMeasurePoint>[]>(
    () => [
      {
        field: 'measureName',
        headerName: 'Measure Name',
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
      { field: 'setValue', headerName: 'Set Value', flex: 1 },
      {
        field: 'operationalMinValue',
        headerName: 'Min Value',
        flex: 1,
      },
      {
        field: 'operationalMaxValue',
        headerName: 'Max Value',
        flex: 1,
      },
      {
        field: 'orderNo',
        headerName: 'Order No',
        width: 100,
      },
    ],
    []
  )

  return (
    <CustomizedDataGrid
      label={label || 'Measures'}
      rows={rows}
      columns={columns}
      loading={loading}
      showToolbar
      onRefreshClick={fetchData}
      getRowId={row => row.compTypeMeasurePointId}
    />
  )
}

export default TabMeasuresPage
