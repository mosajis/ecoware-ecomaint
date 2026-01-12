import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import TabsComponent from './MaintLogTabs'
import Splitter from '@/shared/components/Splitter/Splitter'
import ReportWorkDialog from '../reportWork/ReportWorkDialog'
import {
  tblCompStatus,
  tblMaintLog,
  TypeTblMaintLog,
} from '@/core/api/generated/api'
import { useDataGrid } from '@/shared/hooks/useDataGrid'
import { useCallback, useState } from 'react'
import { columns } from './MaintLogColumns'

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
      include: {
        tblWorkOrder: true,
        tblComponentUnit: {
          include: {
            tblCompStatus: true,
          },
        },
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
