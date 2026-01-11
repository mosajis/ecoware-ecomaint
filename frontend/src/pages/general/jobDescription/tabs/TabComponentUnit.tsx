import CellDateTime from '@/shared/components/dataGrid/cells/CellDateTime'
import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import { useCallback } from 'react'
import { GridColDef } from '@mui/x-data-grid'
import { useDataGrid } from '@/shared/hooks/useDataGrid'
import {
  tblCompJob,
  tblComponentUnit,
  TypeTblCompJob,
} from '@/core/api/generated/api'
import CellFrequency from '@/shared/components/dataGrid/cells/CellFrequency'

interface Props {
  jobDescriptionId?: number | null
  label?: string
}

const getRowId = (row: TypeTblCompJob) => row.compJobId

const columns: GridColDef<TypeTblCompJob>[] = [
  {
    field: 'compNo',
    headerName: 'Component',
    flex: 1,
    valueGetter: (_, r) => r?.tblComponentUnit?.compNo,
  },
  {
    field: 'jobDescCode',
    headerName: 'Job Code',
    width: 85,
    valueGetter: (_, r) => r?.tblJobDescription?.jobDescCode,
  },
  {
    field: 'jobTitle',
    headerName: 'Job Title',
    flex: 1,
    valueGetter: (_, r) => r?.tblJobDescription?.jobDescTitle,
  },
  {
    field: 'disciplineName',
    headerName: 'Disipline',
    width: 90,
    valueGetter: (_, r) => r?.tblDiscipline?.name,
  },
  {
    field: 'frequency',
    headerName: 'Frequency',
    width: 95,
    renderCell: ({ row, value }) => (
      <CellFrequency frequency={value} frequencyPeriod={row.tblPeriod} />
    ),
  },
  {
    field: 'lastDone',
    headerName: 'Last Done',
    width: 130,
    renderCell: ({ value }) => <CellDateTime value={value} />,
  },

  {
    field: 'nextDueDate',
    headerName: 'Next DueDate',
    width: 130,
    renderCell: ({ value }) => <CellDateTime value={value} />,
  },
  {
    field: 'priority',
    headerName: 'Priority',
    width: 70,
  },
  {
    field: 'window',
    headerName: 'Window',
    width: 75,
  },
]

export default function TabComponentUnit(props: Props) {
  const { jobDescriptionId, label } = props

  const getAll = useCallback(() => {
    return tblCompJob.getAll({
      filter: {
        jobDescId: jobDescriptionId,
      },
      include: {
        tblComponentUnit: true,
        tblJobDescription: true,
        tblDiscipline: true,
        tblPeriod: true,
      },
    })
  }, [jobDescriptionId])

  const { rows, loading, handleRefresh } = useDataGrid(
    getAll,
    tblComponentUnit.deleteById,
    'compId',
    !!jobDescriptionId
  )

  return (
    <CustomizedDataGrid
      disableAdd
      disableEdit
      disableDelete
      disableRowSelectionOnClick
      disableRowNumber
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
