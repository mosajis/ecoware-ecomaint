import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import { useCallback } from 'react'
import { GridColDef } from '@mui/x-data-grid'
import {
  tblCompJob,
  tblComponentUnit,
  tblPeriod,
  TypeTblCompJob,
  TypeTblComponentUnit,
} from '@/core/api/generated/api'
import { useDataGrid } from '@/shared/hooks/useDataGrid'
import { formatDateTime } from '@/core/api/helper'
import { useAtomValue } from 'jotai'
import { atomLanguage } from '@/shared/atoms/general.atom'

interface TabComponentUnitProps {
  jobDescriptionId?: number | null
  label?: string | null
}

export default function TabComponentUnit(props: TabComponentUnitProps) {
  const { jobDescriptionId, label } = props

  const lang = useAtomValue(atomLanguage)
  const columns: GridColDef<TypeTblCompJob>[] = [
    {
      field: 'compNo',
      headerName: 'Component',
      flex: 1,
      valueGetter: (_, r) => r.tblComponentUnit?.compNo,
    },
    {
      field: 'code',
      headerName: 'Code',
      flex: 1,
      valueGetter: (_, r) => r.tblJobDescription?.jobDescCode,
    },
    {
      field: 'jobTitle',
      headerName: 'Job Title',
      flex: 1,
      valueGetter: (_, r) => r.tblJobDescription?.jobDescTitle,
    },
    {
      field: 'disciplineName',
      headerName: 'Disipline',
      flex: 1,
      valueGetter: (_, r) => r?.tblDiscipline?.name,
    },
    {
      field: 'frequency',
      headerName: 'Frequency',
      width: 100,
    },
    {
      field: 'frequencyPeriod',
      headerName: 'Period',
      width: 100,
      valueGetter: (_, r) => r.tblPeriod?.name,
    },
    {
      field: 'lastDone',
      headerName: 'Last Done',
      width: 130,
      valueFormatter: value =>
        value ? formatDateTime(value, 'DATETIME', lang === 'fa') : '',
    },

    {
      field: 'nextDueDate',
      headerName: 'Next DueDate',
      width: 130,
      valueFormatter: value =>
        value ? formatDateTime(value, 'DATETIME', lang === 'fa') : '',
    },
    {
      field: 'priority',
      headerName: 'Priority',
      flex: 1,
      // valueGetter: (_, r) => r.priority,
    },
    {
      field: 'window',
      headerName: 'Window',
      flex: 1,
      // valueGetter: (_, r) => r.window,
    },
  ]
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

  const { rows, loading, fetchData } = useDataGrid(
    getAll,
    tblComponentUnit.deleteById,
    'compId',
    !!jobDescriptionId
  )

  return (
    <CustomizedDataGrid
      rows={rows}
      columns={columns}
      loading={loading}
      label={label || 'Component Unit Jobs'}
      showToolbar
      onRefreshClick={fetchData}
      getRowId={row => row.compJobId}
    />
  )
}
