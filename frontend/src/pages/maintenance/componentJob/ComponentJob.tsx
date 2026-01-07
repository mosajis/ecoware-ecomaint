import Splitter from '@/shared/components/Splitter/Splitter'
import Editor from '@/shared/components/Editor'
import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import { useState, useCallback, useMemo } from 'react'
import { useDataGrid } from '@/shared/hooks/useDataGrid'
import {
  tblCompJob,
  tblJobDescription,
  type TypeTblCompJob,
} from '@/core/api/generated/api'
import {
  GridRowSelectionCheckboxParams,
  type GridColDef,
} from '@mui/x-data-grid'
import CellDateTime from '@/shared/components/dataGrid/cells/CellDateTime'

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

  const { rows, loading, handleRefresh, handleDelete } = useDataGrid(
    getAll,
    tblCompJob.deleteById,
    'compJobId'
  )

  const handleRowClick = (params: any) => {
    setSelected(params.row)
  }

  const columns: GridColDef<TypeTblCompJob>[] = [
    {
      field: 'compTypeName',
      headerName: 'CompType Name',
      flex: 1,
      // @ts-ignore
      valueGetter: (value, row) => row.tblComponentUnit?.tblCompType.compType,
    },

    {
      field: 'compNo',
      headerName: 'CompNo',
      flex: 1,
      valueGetter: (value, row) => row.tblComponentUnit?.compNo,
    },

    {
      field: 'jobCode',
      headerName: 'Job Code',
      flex: 1,
      valueGetter: (value, row) => row.tblJobDescription?.jobDescCode,
    },

    {
      field: 'jobTitle',
      headerName: 'Job Title',
      flex: 1,
      valueGetter: (value, row) => row.tblJobDescription?.jobDescTitle,
    },

    {
      field: 'jobDisiplice',
      headerName: 'Job Disiplice',
      flex: 1,
      valueGetter: (value, row) => row.tblDiscipline?.name,
    },

    { field: 'frequency', headerName: 'Frequency', flex: 1 },

    {
      field: 'frequencyPeriod',
      headerName: 'Frequency Period',
      flex: 1,
      valueGetter: (value, row) => row.tblPeriod?.name,
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

    { field: 'realOverDue', headerName: 'RealOverDue', flex: 1 },
    { field: 'lastTimeDone', headerName: 'LastTimeDone', flex: 1 },
  ]

  return (
    <>
      <Splitter initialPrimarySize='70%' horizontal>
        <CustomizedDataGrid
          rows={rows}
          loading={loading}
          columns={columns}
          label='Component Job'
          showToolbar
          onRefreshClick={handleRefresh}
          getRowId={row => row.compJobId}
          onRowClick={handleRowClick}
        />

        <Editor
          label={selected?.tblJobDescription?.jobDescTitle || 'Job Description'}
          readOnly
          key={selected?.compJobId}
          initValue={selected?.tblJobDescription?.jobDesc}
        />
      </Splitter>
    </>
  )
}
