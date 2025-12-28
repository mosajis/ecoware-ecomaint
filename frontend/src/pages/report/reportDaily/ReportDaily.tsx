import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import { GridColDef } from '@mui/x-data-grid'
import { useCallback, useMemo, useState } from 'react'
import { dataGridActionColumn } from '@/shared/components/dataGrid/DataGridActionsColumn'
import { useDataGrid } from '@/shared/hooks/useDataGrid'
import { tblStockType, TypeTblStockType } from '@/core/api/generated/api'

export default function PageReportDaily() {
  const [openForm, setOpenForm] = useState(false)
  const [mode, setMode] = useState<'create' | 'update'>('create')
  const [selected, setSelected] = useState<TypeTblStockType | null>(null)

  const { rows, loading, handleRefresh, handleDelete } = useDataGrid(
    tblStockType.getAll,
    tblStockType.deleteById,
    'stockTypeId'
  )

  // === Handlers ===
  const handleCreate = useCallback(() => {
    setSelected(null)
    setMode('create')
    setOpenForm(true)
  }, [])

  const handleEdit = useCallback((row: TypeTblStockType) => {
    setSelected(row)
    setMode('update')
    setOpenForm(true)
  }, [])

  // === Columns ===
  const columns: GridColDef<TypeTblStockType>[] = useMemo(
    () => [
      { field: 'partName', headerName: 'Number', width: 120 },
      { field: 'makerRef', headerName: 'Comp No', flex: 2 },
      {
        field: 'MESC',
        headerName: 'Failure Date',
        flex: 1,
        valueGetter: (value, row) => row?.tblJobClass?.name,
      },
      { field: 'extraNo', headerName: 'Title', flex: 1 },
      { field: 'changeReason', headerName: 'Total Wait', flex: 1 },
      { field: 'notes', headerName: 'Disc. Name', flex: 1 },
      { field: 'description', headerName: 'Last Updated', flex: 1 },
      { field: 'farsiDescription', headerName: 'Loged By', flex: 1 },
      { field: 'farsiDescription', headerName: 'Approved By', flex: 1 },
      { field: 'farsiDescription', headerName: 'Closed By', flex: 1 },
      { field: 'farsiDescription', headerName: 'Closed Date', flex: 1 },
      dataGridActionColumn({ onEdit: handleEdit, onDelete: handleDelete }),
    ],
    [handleEdit, handleDelete]
  )

  // === SAVE DESCRIPTION ===
  const handleSaveDescription = async (newValue: string) => {
    // if (!selected) return
    // await tblJobDescription.update(selected.jobDescId, {
    //   jobDesc: newValue,
    // })
    // handleRefresh()
  }

  const handleRowClick = (params: any) => {
    // setSelected(params.row)
    // setHtml(params.row.jobDesc || '')
  }

  return (
    <CustomizedDataGrid
      label='Daily Report'
      getRowId={row => row.stockTypeId}
      loading={loading}
      onAddClick={handleCreate}
      rows={rows}
      onRefreshClick={handleRefresh}
      columns={columns}
      showToolbar
      onRowClick={handleRowClick}
    />
  )
}
