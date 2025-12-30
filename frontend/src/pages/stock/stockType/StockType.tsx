import Splitter from '@/shared/components/Splitter'
import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import StockTypeFormDialog from './StockTypeUpsert'
import CustomizedTree from '@/shared/components/tree/CustomeTree'
import { useState, useCallback } from 'react'
import { tblStockType, TypeTblStockType } from '@/core/api/generated/api'
import { dataGridActionColumn } from '@/shared/components/dataGrid/DataGridActionsColumn'
import { GridColDef } from '@mui/x-data-grid'
import { useDataTree } from '@/shared/hooks/useDataTree'

export default function PageStockType() {
  const [openForm, setOpenForm] = useState(false)
  const [mode, setMode] = useState<'create' | 'update'>('create')
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null)

  // === Mapping Transformer ===
  const mapper = useCallback(
    (row: TypeTblStockType) => ({
      id: row.stockTypeId.toString(),
      label: row.name ?? '',
      parentId: row.parentStockTypeId?.toString() ?? null,
      data: row,
    }),
    []
  )

  // === useDataTree ===
  const {
    rows,
    treeItems,
    loading,
    handleDelete,
    handleFormSuccess,
    handleRefresh,
  } = useDataTree(
    tblStockType.getAll,
    tblStockType.deleteById,
    'stockTypeId',
    mapper
  )

  // === Handlers ===
  const handleCreate = () => {
    setSelectedRowId(null)
    setMode('create')
    setOpenForm(true)
  }

  const handleEdit = (row: TypeTblStockType) => {
    setSelectedRowId(row.stockTypeId)
    setMode('update')
    setOpenForm(true)
  }

  // === Columns ===
  const columns: GridColDef<TypeTblStockType>[] = [
    { field: 'no', headerName: 'No', width: 80 },
    { field: 'name', headerName: 'Name', flex: 1 },
    {
      field: 'deptId',
      headerName: 'Department ID',
      width: 120,
    },
    {
      field: 'orderNo',
      headerName: 'Order No',
      width: 80,
    },
    dataGridActionColumn({
      onEdit: handleEdit,
      onDelete: handleDelete,
    }),
  ]

  return (
    <>
      <Splitter>
        {/* === TREE VIEW === */}
        <CustomizedTree
          onRefresh={handleRefresh}
          label='Tree View'
          items={treeItems}
          loading={loading}
          getRowId={row => row.stockTypeId}
          onAddClick={handleCreate}
          onEditClick={handleEdit}
          onDeleteClick={handleDelete}
        />

        {/* === GRID VIEW === */}
        <CustomizedDataGrid
          showToolbar
          label='List View'
          loading={loading}
          rows={rows}
          columns={columns}
          onRefreshClick={handleRefresh}
          onAddClick={handleCreate}
          getRowId={row => row.stockTypeId}
        />
      </Splitter>

      {/* === FORM === */}
      <StockTypeFormDialog
        open={openForm}
        mode={mode}
        recordId={selectedRowId}
        onClose={() => setOpenForm(false)}
        onSuccess={handleFormSuccess}
      />
    </>
  )
}
