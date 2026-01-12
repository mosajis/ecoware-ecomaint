import { GridColDef } from '@mui/x-data-grid'
import { TypeTblWorkOrderWithRels } from './types'
import StatusChip from './customCell/Status'
import OverdueText from './customCell/OverDue'
import { calculateOverdue } from '@/core/api/helper'
import CellDateTime from '@/shared/components/dataGrid/cells/CellDateTime'
import CellOverdue from './customCell/OverDue'

export const columns: GridColDef<TypeTblWorkOrderWithRels>[] = [
  {
    field: 'jobCode',
    headerName: 'Job Code',
    width: 90,
    valueGetter: (_, row) => row?.tblCompJob?.tblJobDescription?.jobDescCode,
  },
  {
    field: 'component',
    headerName: 'Component',
    flex: 2,
    valueGetter: (_, row) => row.tblComponentUnit?.compNo,
  },
  {
    field: 'location',
    headerName: 'Location',
    flex: 1,
    valueGetter: (_, row) => row?.tblComponentUnit?.tblLocation?.name,
  },
  {
    field: 'jobDescTitle',
    headerName: 'Job Desc',
    flex: 2,
    valueGetter: (_, row) => row?.tblCompJob?.tblJobDescription?.jobDescTitle,
  },
  {
    field: 'discipline',
    headerName: 'Discipline',
    width: 90,
    valueGetter: (_, row) => row?.tblDiscipline?.name,
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 95,
    valueGetter: (_, row) => row?.tblWorkOrderStatus?.name,
    renderCell: params => <StatusChip status={params.value} />,
  },
  {
    field: 'dueDate',
    headerName: 'Due Date',
    width: 130,
    renderCell: ({ value }) => <CellDateTime value={value} />,
  },
  {
    field: 'completed',
    headerName: 'Completed Date',
    width: 130,
    renderCell: ({ value }) => <CellDateTime value={value} />,
  },
  {
    field: 'overDue',
    headerName: 'OverDue',
    width: 80,
    valueGetter: (_, row) => calculateOverdue(row),
    renderCell: params => <CellOverdue value={params.value} />,
  },
  {
    field: 'pendingType',
    headerName: 'Pending Type',
    valueGetter: (_, row) => row?.tblPendingType?.pendTypeName,
  },
  {
    field: 'priority',
    headerName: 'Priority',
    width: 70,
  },
]
