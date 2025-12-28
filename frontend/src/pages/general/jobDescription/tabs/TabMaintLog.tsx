import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import { useCallback, useState } from 'react'
import { tblMaintLog, TypeTblMaintLog } from '@/core/api/generated/api'
import { GridColDef } from '@mui/x-data-grid'
import { useDataGrid } from '@/shared/hooks/useDataGrid'
import { formatDateTime } from '@/core/api/helper'
import { useAtomValue } from 'jotai'
import { atomLanguage } from '@/shared/atoms/general.atom'
import ReportWorkDialog from '@/pages/maintenance/reportWork/ReportWorkDialog'
import { dataGridActionColumn } from '@/shared/components/dataGrid/DataGridActionsColumn'

interface TabMaintLogProps {
  label?: string | null
  jobDescriptionId: number
}

export default function TabMaintLog(props: TabMaintLogProps) {
  const { label, jobDescriptionId } = props
  const [openDialogReportWork, setOpenDialogReportWork] = useState(false)
  const [selectedRow, setSelectedRow] = useState<TypeTblMaintLog | null>(null)
  const lang = useAtomValue(atomLanguage)

  const getAll = useCallback(() => {
    return tblMaintLog.getAll({
      filter: {
        jobDescId: jobDescriptionId,
      },
      include: {
        tblComponentUnit: true,
        tblJobDescription: true,
        tblMaintClass: true,
      },
    })
  }, [jobDescriptionId])

  const columns: GridColDef<TypeTblMaintLog>[] = [
    {
      field: 'component',
      headerName: 'Component',
      flex: 1,
      valueGetter: (_, r) => r.tblComponentUnit?.compNo,
    },
    {
      field: 'jobCode',
      headerName: 'JobCode',
      width: 120,
      valueGetter: (_, r) => r.tblJobDescription?.jobDescCode,
    },

    {
      field: 'job Title',
      headerName: 'JobTitle',
      flex: 1,
      valueGetter: (_, r) => r.tblJobDescription?.jobDescTitle,
    },
    {
      field: 'dateDone',
      headerName: 'DateDone',
      width: 130,
      valueFormatter: value =>
        value ? formatDateTime(value, 'DATETIME', lang === 'fa') : '',
    },
    {
      field: 'maintClass',
      headerName: 'Maint Class',
      width: 150,
      valueGetter: (_, r) => r.tblMaintClass?.descr,
    },
    {
      field: 'totalDuration',
      headerName: 'Total Duration',
      width: 120,
      valueGetter: (_, r) => r.totalDuration,
    },

    {
      field: 'downTime',
      headerName: 'DownTime (Min)',
      width: 120,
      valueGetter: (_, r) => r.downTime,
    },
    dataGridActionColumn({
      onEdit: () => {
        setOpenDialogReportWork(true)
      },
    }),
  ]

  const { rows, loading, fetchData } = useDataGrid(
    getAll,
    tblMaintLog.deleteById,
    'maintLogId',
    !!jobDescriptionId
  )

  const handleRowClick = (params: any) => {
    setOpenDialogReportWork(true)
    setSelectedRow(params.row)
  }

  return (
    <>
      <CustomizedDataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        label={label || 'Maintenance Log'}
        showToolbar
        onRefreshClick={fetchData}
        getRowId={row => row.maintLogId}
      />
      <ReportWorkDialog
        open={openDialogReportWork}
        onClose={() => setOpenDialogReportWork(false)}
        maintLogId={selectedRow?.maintLogId}
      />
    </>
  )
}
