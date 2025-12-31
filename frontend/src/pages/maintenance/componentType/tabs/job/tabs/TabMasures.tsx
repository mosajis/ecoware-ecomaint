import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import { useCallback, useMemo } from 'react'
import { GridColDef } from '@mui/x-data-grid'
import { useDataGrid } from '@/shared/hooks/useDataGrid'
import {
  tblCompTypeJobMeasurePoint,
  tblCompTypeMeasurePoint,
  tblCounterType,
  TypeTblCompTypeJob,
  TypeTblCompTypeJobMeasurePoint,
  type TypeTblCompTypeMeasurePoint,
} from '@/core/api/generated/api'

type Props = {
  compTypeJob?: TypeTblCompTypeJob | null
}

const TabMeasuresPage = ({ compTypeJob }: Props) => {
  // === getAll callback ===

  const getAll = useCallback(() => {
    return tblCompTypeJobMeasurePoint.getAll({
      include: {
        tblCompTypeMeasurePoint: {
          include: {
            tblUnit: true,
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
  const { rows, loading, fetchData, handleDelete } = useDataGrid(
    getAll,
    tblCompTypeMeasurePoint.deleteById,
    'compTypeMeasurePointId',
    !!compTypeJob
  )

  // === Columns ===
  const columns = useMemo<GridColDef<TypeTblCompTypeMeasurePoint>[]>(
    () => [
      {
        field: 'measureName',
        headerName: 'Measure Name',
        flex: 1,
        // @ts-ignore
        // @ts-ignore
        valueGetter: (v, row) =>
          // @ts-ignore
          row?.tblCompTypeMeasurePoint?.tblCounterType?.name,
      },
      {
        field: 'unitName',
        headerName: 'Unit Name',
        flex: 1,
        // @ts-ignore

        valueGetter: (v, row) => row?.tblCompTypeMeasurePoint?.tblUnit?.name,
      },
      {
        field: 'unitDescription',
        headerName: 'Unit Description',
        flex: 1,
        // @ts-ignore
        valueGetter: (v, row) =>
          // @ts-ignore
          row?.tblCompTypeMeasurePoint?.tblUnit?.description,
      },
      {
        field: 'minValue',
        headerName: 'Min Value',
        flex: 1,
      },
      {
        field: 'maxValue',
        headerName: 'Max Value',
        flex: 1,
      },
    ],
    []
  )

  return (
    <CustomizedDataGrid
      label={compTypeJob?.tblJobDescription?.jobDescTitle || 'Measures'}
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
