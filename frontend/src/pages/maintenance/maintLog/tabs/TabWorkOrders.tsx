import { useCallback, useMemo } from 'react'
import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import { useDataGrid } from '@/shared/hooks/useDataGrid'
import { GridColDef } from '@mui/x-data-grid'
import {
  tblWorkOrder,
  TypeTblMaintLog,
  TypeTblWorkOrder,
} from '@/core/api/generated/api'
import { TypeTblWorkOrderWithRels } from '../../workOrder/types'
import { calculateOverdue, formatDateTime } from '@/core/api/helper'
import StatusChip from '../../workOrder/customCell/Status'
import OverdueText from '../../workOrder/customCell/OverDue'

interface Props {
  selected: TypeTblMaintLog
  label?: string | null
}

const TabWorkOrder = ({ selected, label }: Props) => {
  const getAll = useCallback(() => {
    return tblWorkOrder.getAll({
      filter: {
        tblMaintLogs: {
          some: {
            maintLogId: selected.maintLogId,
          },
        },
      },
      include: {
        tblComponentUnit: {
          include: {
            tblCompStatus: true,
            tblLocation: true,
          },
        },
        tblCompJob: {
          include: {
            tblJobDescription: true,
            tblPeriod: true,
          },
        },
        tblPendingType: true,
        tblDiscipline: true,
        tblWorkOrderStatus: true,
      },
    })
  }, [selected?.maintLogId])

  const { rows, loading, handleRefresh } = useDataGrid(
    getAll,
    tblWorkOrder.deleteAll,
    'workOrderId',
    !!selected?.maintLogId
  )

  const columns = useMemo<GridColDef<TypeTblWorkOrderWithRels>[]>(
    () => [
      {
        field: 'jobCode',
        headerName: 'JobCode',
        width: 140,
        valueGetter: (_, row) =>
          row?.tblCompJob?.tblJobDescription?.jobDescCode,
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
        width: 100,
        valueGetter: (_, row) => row?.tblComponentUnit?.tblLocation?.name,
      },
      {
        field: 'jobDescTitle',
        headerName: 'Job Desc',
        flex: 2,
        valueGetter: (_, row) =>
          row?.tblCompJob?.tblJobDescription?.jobDescTitle,
      },
      {
        field: 'discipline',
        headerName: 'Discipline',
        width: 110,
        valueGetter: (_, row) => row?.tblDiscipline?.name,
      },

      {
        field: 'status',
        headerName: 'Status',
        width: 90,
        valueGetter: (_, row) => row?.tblWorkOrderStatus?.name,
        renderCell: params => <StatusChip status={params.value} />,
      },
      {
        field: 'dueDate',
        headerName: 'Due Date',
        width: 130,
        valueFormatter: value => (value ? formatDateTime(value) : ''),
      },
      {
        field: 'completed',
        headerName: 'Completed Date',
        width: 130,
        valueFormatter: value => (value ? formatDateTime(value) : ''),
      },
      {
        field: 'overDue',
        headerName: 'OverDue',
        width: 80,
        valueGetter: (_, row) => calculateOverdue(row),
        renderCell: params => <OverdueText value={params.value} />,
      },

      {
        field: 'pendingType',
        headerName: 'Pending Type',
        valueGetter: (_, row) => row?.tblPendingType?.pendTypeName,
      },
    ],
    []
  )

  return (
    <CustomizedDataGrid
      label={label ?? 'Work Orders'}
      showToolbar
      rows={rows}
      columns={columns}
      loading={loading}
      onRefreshClick={handleRefresh}
      getRowId={row => row.workOrderId}
    />
  )
}

export default TabWorkOrder
