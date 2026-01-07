import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import TabsComponent from './MaintLogTabs'
import Splitter from '@/shared/components/Splitter/Splitter'
import ReportWorkDialog from '../reportWork/ReportWorkDialog'
import {
  tblMaintCause,
  tblMaintLog,
  tblMaintType,
  tblWorkOrder,
  TypeTblMaintLog,
} from '@/core/api/generated/api'
import { useDataGrid } from '@/shared/hooks/useDataGrid'
import { GridColDef } from '@mui/x-data-grid'
import { useCallback, useMemo, useState } from 'react'
import { dataGridActionColumn } from '@/shared/components/dataGrid/DataGridActionsColumn'
import { formatDateTime } from '@/core/api/helper'

export default function PageMaintLog() {
  const [openDialogReportWork, setOpenDialogReportWork] = useState(false)
  const [selectedRow, setSelectedRow] = useState<TypeTblMaintLog | null>(null)
  const [mode, setMode] = useState<'create' | 'update'>('create')

  const handleEdit = (row: TypeTblMaintLog) => {
    setMode('update')
    setSelectedRow(row)
    setOpenDialogReportWork(true)
  }

  const handleRowClick = (params: any) => {
    setSelectedRow(params.row)
  }

  const handleAddClick = () => {
    setMode('create')
    setOpenDialogReportWork(true)
  }

  const getAll = useCallback(() => {
    return tblMaintLog.getAll({
      paginate: true,
      perPage: 10,
      include: {
        tblWorkOrder: true,
        tblComponentUnit: true,
        tblMaintClass: true,
        tblJobDescription: true,
      },
    })
  }, [])

  const { rows, loading, handleRefresh, handleDelete } = useDataGrid(
    getAll,
    tblMaintLog.deleteById,
    'maintLogId'
  )

  const columns = useMemo<GridColDef<TypeTblMaintLog>[]>(
    () => [
      {
        field: 'component',
        headerName: 'Component',
        flex: 1,
        valueGetter: (_, row) => row.tblComponentUnit?.compNo ?? '',
      },
      {
        field: 'jobCode',
        headerName: 'JobCode',
        width: 100,
        valueGetter: (_, row) => row.tblJobDescription?.jobDescCode ?? '',
      },
      {
        field: 'jobDescTitle',
        headerName: 'jobDescTitle',
        flex: 1,
        valueGetter: (_, row) => row.tblJobDescription?.jobDescTitle ?? '',
      },
      {
        field: 'dateDone',
        headerName: 'DateDone',
        width: 130,
        valueFormatter: value => (value ? formatDateTime(value) : ''),
      },
      // {
      //   field: 'discipline',
      //   headerName: 'Discipline',
      //   valueGetter: (_, row) => row.name ?? "",
      // },
      // {
      //   field: 'reportedBy',
      //   headerName: 'Reported By',
      //   // valueGetter: (row) => row.tblUserReported?.fullName ?? "",
      // },
      // {
      //   field: 'followStatus',
      //   headerName: 'Follow Status',
      //   valueGetter: (_, row) => row.tblFollowStatus?.fsName ?? '',
      // },
      // {
      //   field: 'currentStatus',
      //   headerName: 'Current Status',
      //   valueGetter: (_, row) => row.tblMaintStatus?.name ?? "",
      // },
      // {
      //   field: 'followCount',
      //   headerName: 'Follow Count',
      // },
      // {
      //   field: 'follower',
      //   headerName: 'Follower',
      //   valueGetter: (row) => row.tblUserFollower?.fullName ?? "",
      // },
      // {
      //   field: 'statusId',
      //   headerName: 'Status',
      // },
      // {
      //   field: 'stockUsed',
      //   headerName: 'Stock Used',
      // },
      // {
      //   field: 'empHours',
      //   headerName: 'Emp/HRS',
      // },
      {
        field: 'maintClass',
        headerName: 'Maint Class',
        valueGetter: (_, row) => row.tblMaintClass?.descr ?? '',
      },
      // {
      //   field: 'totalAttachment',
      //   headerName: 'Total Attachment',
      // },
      {
        field: 'downTime',
        headerName: 'DownTime',
      },
      // {
      //   field: 'componentStatusName',
      //   headerName: 'Component Status Name',
      //   width: 180,
      //   valueGetter: (_, row) => row.tblComponentUnit.?.name ?? "",
      // },
      // {
      //   field: 'isCritical',
      //   headerName: 'IsCritical',
      //   // valueGetter: (row) => (row.isCritical ? "Yes" : "No"),
      // },
      {
        field: 'unplanned',
        headerName: 'Unplanned',
        type: 'boolean',
      },

      dataGridActionColumn({ onDelete: handleDelete, onEdit: handleEdit }),
    ],
    []
  )

  return (
    <>
      <Splitter horizontal>
        <CustomizedDataGrid
          showToolbar
          rows={rows}
          columns={columns}
          loading={loading}
          onAddClick={handleAddClick}
          label={'Maintenance Log'}
          onRowClick={handleRowClick}
          onRefreshClick={handleRefresh}
          getRowId={row => row.maintLogId}
        />
        <TabsComponent selectedMaintLog={selectedRow} />
      </Splitter>
      <ReportWorkDialog
        open={openDialogReportWork}
        onClose={() => setOpenDialogReportWork(false)}
        maintLogId={mode === 'update' ? selectedRow?.maintLogId : undefined}
      />
    </>
  )
}
