import { TypeTblMaintLog } from '@/core/api/generated/api'
import CellDateTime from '@/shared/components/dataGrid/cells/CellDateTime'
import { GridColDef } from '@mui/x-data-grid'

export const columns: GridColDef<TypeTblMaintLog>[] = [
  {
    field: 'component',
    headerName: 'Component',
    flex: 1,
    valueGetter: (_, row) => row?.tblComponentUnit?.compNo,
  },
  {
    field: 'jobCode',
    headerName: 'JobCode',
    width: 100,
    valueGetter: (_, row) => row?.tblJobDescription?.jobDescCode,
  },
  {
    field: 'jobDescTitle',
    headerName: 'jobDescTitle',
    flex: 1,
    valueGetter: (_, row) => row?.tblJobDescription?.jobDescTitle,
  },
  {
    field: 'dateDone',
    headerName: 'DateDone',
    width: 130,
    renderCell: ({ value }) => <CellDateTime value={value} />,
  },

  {
    field: 'discipline',
    headerName: 'Discipline',
  },
  {
    field: 'reportedBy',
    headerName: 'Reported By',
  },
  {
    field: 'followStatus',
    headerName: 'Follow Status',
  },
  {
    field: 'currentStatus',
    headerName: 'Current Status',
  },
  {
    field: 'followCount',
    headerName: 'Follow Count',
  },
  {
    field: 'follower',
    headerName: 'Follower',
  },
  {
    field: 'statusId',
    headerName: 'Status',
  },
  {
    field: 'stockUsed',
    headerName: 'Stock Used',
  },
  {
    field: 'empHours',
    headerName: 'Emp/HRS',
  },
  {
    field: 'maintClass',
    headerName: 'Maint Class',
    valueGetter: (_, row) => row?.tblMaintClass?.descr ?? '',
  },
  {
    field: 'totalAttachment',
    headerName: 'Total Attachment',
  },
  {
    field: 'downTime',
    headerName: 'DownTime',
    renderCell: ({ value }) => <CellDateTime value={value} />,
  },
  {
    field: 'componentStatusName',
    headerName: 'Component Status Name',
    width: 180,
    // valueGetter: (_, row) => row?.tblComponentUnit?.tblCompStatus?.name ?? '',
  },
  {
    field: 'isCritical',
    headerName: 'IsCritical',
    type: 'boolean',
    width: 80,
  },
  {
    field: 'unplanned',
    headerName: 'Unplanned',
    type: 'boolean',
    width: 95,
  },
]
