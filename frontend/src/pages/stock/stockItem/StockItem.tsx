import Splitter from '@/shared/components/Splitter/Splitter'
import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import StockItemFormDialog from './StockItemUpsert'
import CustomizedTree from '@/shared/components/tree/Tree'
import { useState, useCallback } from 'react'
import {
  tblStockItem,
  tblStockType,
  TypeTblStockItem,
} from '@/core/api/generated/api'
import { dataGridActionColumn } from '@/shared/components/dataGrid/DataGridActionsColumn'
import { GridColDef } from '@mui/x-data-grid'
import { useDataTree } from '@/shared/hooks/useDataTree'
import { useDataGrid } from '@/shared/hooks/useDataGrid'

export default function PageStockItem() {
  const [openForm, setOpenForm] = useState(false)
  const [mode, setMode] = useState<'create' | 'update'>('create')
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null)

  const getAll = useCallback(() => {
    return tblStockItem.getAll({
      include: {
        tblStockType: true,
      },
    })
  }, [])
  // === useDataTree ===
  const { rows, loading, handleDelete, handleFormSuccess, handleRefresh } =
    useDataGrid(getAll, tblStockItem.deleteById, 'stockItemId')

  // === Handlers ===
  const handleCreate = () => {
    setSelectedRowId(null)
    setMode('create')
    setOpenForm(true)
  }

  const handleEdit = (row: TypeTblStockItem) => {
    setSelectedRowId(row.stockItemId)
    setMode('update')
    setOpenForm(true)
  }

  // === Columns ===
  const columns: GridColDef<TypeTblStockItem>[] = [
    {
      field: 'stockItemId',
      headerName: 'Stock Item ID',
      width: 100,
    },
    {
      field: 'tblStockType',
      headerName: 'Stock Type',
      flex: 1,
      renderCell: params => params.row.tblStockType?.name ?? '-',
    },
    {
      field: 'deptId',
      headerName: 'Department ID',
      width: 120,
    },
    dataGridActionColumn({
      onEdit: handleEdit,
      onDelete: handleDelete,
    }),
  ]

  return (
    <>
      <CustomizedDataGrid
        showToolbar
        label='List View'
        loading={loading}
        rows={rows}
        columns={columns}
        onRefreshClick={handleRefresh}
        onAddClick={handleCreate}
        getRowId={row => row.stockItemId}
      />

      {/* === FORM === */}
      <StockItemFormDialog
        open={openForm}
        mode={mode}
        recordId={selectedRowId}
        onClose={() => setOpenForm(false)}
        onSuccess={handleFormSuccess}
      />
    </>
  )
}
