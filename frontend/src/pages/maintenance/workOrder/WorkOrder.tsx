import ReportPrintDialog from './WorkOrderDialogReport'
import WorkOrderActionBar from './WorkOrderActions'
import Splitter from '@/shared/components/Splitter/Splitter'
import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import TabsComponent from './WorkOrderTabs'
import StatusChip from './customCell/CellWorkOrderStatus'
import OverdueText from './customCell/CellWorkOrderOverDue'
import { useCallback, useMemo, useState } from 'react'
import { tblWorkOrder } from '@/core/api/generated/api'
import { useDataGrid } from '@/shared/hooks/useDataGrid'
import { GridColDef, GridRowId, GridRowSelectionModel } from '@mui/x-data-grid'
import { calculateOverdue, formatDateTime } from '@/core/api/helper'
import { TypeTblWorkOrderWithRels } from './types'
import WorkOrderFilterDialog, {
  type WorkOrderFilter,
} from './WorkOrderDialogFilter'
import { columns } from './WorkOrderColumns'

export default function WorkOrderPage() {
  const [issueDialogOpen, setIssueDialogOpen] = useState(false)
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([])
  const [filter, setFilter] = useState<WorkOrderFilter | null>(null)
  const [filterOpen, setFilterOpen] = useState(false)

  const getAll = useCallback(
    () =>
      tblWorkOrder.getAll({
        paginate: true,
        perPage: 200,
        filter: filter ?? undefined,
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
      }),
    [filter]
  )

  const { rows, loading, handleRefresh } =
    useDataGrid<TypeTblWorkOrderWithRels>(
      getAll,
      tblWorkOrder.deleteById,
      'workOrderId'
    )

  const selectedWorkOrders = useMemo<TypeTblWorkOrderWithRels[]>(() => {
    return rows.filter(r => selectedRows.includes(r.workOrderId))
  }, [selectedRows, rows])

  const selectedStatuses = selectedWorkOrders
    .map(w => w.tblWorkOrderStatus?.name)
    .filter(w => w !== undefined)

  const handleFilter = useCallback((): void => {
    setFilterOpen(true)
  }, [])

  const handleIssue = useCallback((): void => {
    setIssueDialogOpen(true)
  }, [])

  const handleComplete = useCallback((): void => {}, [])

  const handlePending = useCallback((): void => {}, [])

  const handlePostponed = useCallback((): void => {}, [])

  const handleCancel = useCallback((): void => {}, [])

  const handleRequest = useCallback((): void => {}, [])

  const handleReschedule = useCallback((): void => {}, [])

  const handlePrint = useCallback((): void => {}, [])

  const handleDialogCloseIssue = useCallback(() => {
    setIssueDialogOpen(false)
  }, [])

  const handleRowSelectionChange = useCallback(
    (model: GridRowSelectionModel) => {
      if (model.type === 'include') {
        setSelectedRows(Array.from(model.ids))
      }

      if (model.type === 'exclude') {
        const allIds = rows.map(r => r.workOrderId)
        const excluded = model.ids
        const selected = allIds.filter(id => !excluded.has(id))
        setSelectedRows(selected)
      }
    },
    [rows]
  )

  return (
    <>
      <Splitter horizontal initialPrimarySize='60%'>
        <CustomizedDataGrid
          checkboxSelection
          showToolbar
          label='WorkOrders'
          rows={rows}
          columns={columns}
          loading={loading}
          getRowId={row => row.workOrderId}
          onRowSelectionModelChange={handleRowSelectionChange}
          onRefreshClick={handleRefresh}
          toolbarChildren={
            <WorkOrderActionBar
              selectedStatuses={selectedStatuses}
              onIssue={handleIssue}
              onComplete={handleComplete}
              onPending={handlePending}
              onPostponed={handlePostponed}
              onCancel={handleCancel}
              onRequest={handleRequest}
            />
          }
        />
        <TabsComponent workOrder={selectedWorkOrders[0] || undefined} />
      </Splitter>

      <ReportPrintDialog
        workOrders={selectedWorkOrders}
        open={issueDialogOpen}
        onClose={handleDialogCloseIssue}
        title='Issue WorkOrder'
        onSubmit={() => alert('asd')}
      />

      <WorkOrderFilterDialog
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        onApplyFilter={prismaFilter => {
          setFilter(prismaFilter)
          setFilterOpen(false)
        }}
      />
    </>
  )
}
