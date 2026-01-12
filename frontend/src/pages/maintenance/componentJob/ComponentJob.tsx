import Splitter from '@/shared/components/Splitter/Splitter'
import Editor from '@/shared/components/Editor'
import CellDateTime from '@/shared/components/dataGrid/cells/CellDateTime'
import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import { useState, useCallback } from 'react'
import { useDataGrid } from '@/shared/hooks/useDataGrid'
import {
  tblCompJob,
  tblCompJobCounter,
  type TypeTblCompJob,
} from '@/core/api/generated/api'
import { type GridColDef } from '@mui/x-data-grid'
import CellFrequency from '@/shared/components/dataGrid/cells/CellFrequency'

const columns: GridColDef<TypeTblCompJob>[] = [
  {
    field: 'compNo',
    headerName: 'Component',
    flex: 2,
    valueGetter: (value, row) => row.tblComponentUnit?.compNo,
  },

  {
    field: 'compTypeName',
    headerName: 'CompType',
    flex: 1,
    // @ts-ignore
    valueGetter: (value, row) => row.tblComponentUnit?.tblCompType.compName,
  },

  {
    field: 'jobCode',
    headerName: 'Job Code',
    width: 100,
    valueGetter: (value, row) => row.tblJobDescription?.jobDescCode,
  },

  {
    field: 'jobTitle',
    headerName: 'Job Title',
    flex: 1,
    valueGetter: (value, row) => row.tblJobDescription?.jobDescTitle,
  },

  {
    field: 'discipline',
    headerName: 'Discipline',
    width: 100,
    valueGetter: (value, row) => row.tblDiscipline?.name,
  },

  {
    field: 'frequency',
    headerName: 'Frequency',
    renderCell: ({ row, value }) => (
      <CellFrequency frequency={value} frequencyPeriod={row.tblPeriod} />
    ),
  },

  {
    field: 'lastDone',
    headerName: 'Last Done',
    width: 150,
    renderCell: ({ value }) => <CellDateTime value={value} />,
  },
  {
    field: 'nextDueDate',
    headerName: 'Next Due Date',
    width: 150,
    renderCell: ({ value }) => <CellDateTime value={value} />,
  },

  // { field: 'realOverDue', headerName: 'RealOverDue', flex: 1 },
  // { field: 'lastTimeDone', headerName: 'LastTimeDone', flex: 1 },
]

export default function PageComponentJob() {
  const [selected, setSelected] = useState<TypeTblCompJob | null>(null)

  const getAll = useCallback(() => {
    return tblCompJob.getAll({
      include: {
        tblComponentUnit: {
          include: {
            tblCompType: true,
          },
        },
        tblJobDescription: true,
        tblPeriod: true,
        tblDiscipline: true,
      },
    })
  }, [])

  const { rows, loading, handleRefresh } = useDataGrid(
    getAll,
    tblCompJob.deleteById,
    'compJobId'
  )

  const handleRowClick = (params: any) => {
    setSelected(params.row)
  }

  return (
    <>
      <Splitter initialPrimarySize='70%' horizontal>
        <CustomizedDataGrid
          disableAdd
          disableEdit
          disableDelete
          disableRowNumber
          showToolbar
          rows={rows}
          loading={loading}
          columns={columns}
          label='Component Job'
          onRefreshClick={handleRefresh}
          getRowId={row => row.compJobId}
          onRowClick={handleRowClick}
        />

        <Editor
          readOnly
          label={selected?.tblJobDescription?.jobDescTitle || 'Job Description'}
          key={selected?.compJobId}
          initValue={selected?.tblJobDescription?.jobDesc}
        />
      </Splitter>
    </>
  )
}
