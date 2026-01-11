import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import { useCallback } from 'react'
import { tblCompCounter, TypeTblCompCounter } from '@/core/api/generated/api'
import { GridColDef } from '@mui/x-data-grid'
import { useDataGrid } from '@/shared/hooks/useDataGrid'

interface Props {
  counterTypeId: number | null | undefined
  label?: string
}

const getRowId = (row: TypeTblCompCounter) => row.compCounterId

const columns: GridColDef<TypeTblCompCounter>[] = [
  {
    field: 'compNo',
    headerName: 'Component',
    flex: 2,
    valueGetter: (_, row) => row.tblComponentUnit?.compNo,
  },
  {
    field: 'CompType',
    headerName: 'CompType',
    flex: 2,
    // @ts-ignore
    valueGetter: (_, row) => row.tblComponentUnit?.tblCompType?.compName,
  },
  {
    field: 'model',
    headerName: 'Model',
    flex: 1,
    valueGetter: (_, row) => row.tblComponentUnit?.misc1,
  },
  {
    field: 'serialNo',
    headerName: 'SerialNo',
    flex: 1,
    valueGetter: (_, row) => row.tblComponentUnit?.serialNo,
  },
  {
    field: 'statusId',
    headerName: 'Status',
    width: 80,
    valueGetter: (_, row) =>
      // @ts-ignore
      row.tblComponentUnit?.tblCompStatus?.compStatusName,
  },
]

export default function TabCompUnitCounter(props: Props) {
  const { counterTypeId, label } = props

  const getAll = useCallback(() => {
    return tblCompCounter.getAll({
      filter: { counterTypeId },
      include: {
        tblComponentUnit: {
          include: {
            tblCompType: true,
            tblCompStatus: true,
          },
        },
      },
    })
  }, [counterTypeId])

  const { rows, loading, handleRefresh } = useDataGrid(
    getAll,
    tblCompCounter.deleteById,
    'compCounterId',
    !!counterTypeId
  )

  return (
    <CustomizedDataGrid
      disableEdit
      disableDelete
      disableRowSelectionOnClick
      rows={rows}
      columns={columns}
      loading={loading}
      label={label}
      showToolbar={!!label}
      onRefreshClick={handleRefresh}
      getRowId={getRowId}
    />
  )
}
