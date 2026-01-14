import Splitter from '@/shared/components/Splitter/Splitter'
import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import StockTypeFormDialog from './StockTypeUpsert'
import { useState, useCallback } from 'react'
import { tblStockType, TypeTblStockType } from '@/core/api/generated/api'
import { GridColDef } from '@mui/x-data-grid'
import { useDataTree } from '@/shared/hooks/useDataTree'
import { mapToTree } from '@/shared/components/tree/TreeUtil'
import { GenericTree } from '@/shared/components/tree/Tree'

const getRowId = (row: TypeTblStockType) => row.stockTypeId
const getItemName = (row: TypeTblStockType) => row.name || '-'

// === Columns ===
const columns: GridColDef<TypeTblStockType>[] = [
  { field: 'no', headerName: 'Number', width: 80 },
  { field: 'name', headerName: 'Name', flex: 1 },
  {
    field: 'orderNo',
    headerName: 'Order No',
    width: 80,
  },
]

export default function PageStockType() {
  const [openForm, setOpenForm] = useState(false)
  const [mode, setMode] = useState<'create' | 'update'>('create')
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null)

  // === useDataTree ===
  const treeMapper = useCallback(
    (items: TypeTblStockType[]) =>
      mapToTree(items, 'stockTypeId', 'parentStockTypeId'),
    []
  )

  const getAll = useCallback(() => tblStockType.getAll(), [])

  const { tree, rows, loading, refetch, handleDelete } =
    useDataTree<TypeTblStockType>({
      getAll,
      deleteById: tblStockType.deleteById,
      getId: getRowId,
      mapper: treeMapper,
    })

  // === Handlers ===
  const handleCreate = () => {
    setSelectedRowId(null)
    setMode('create')
    handleUpsertOpen()
  }

  const handleEdit = (rowId: number) => {
    setSelectedRowId(rowId)
    setMode('update')
    handleUpsertOpen()
  }

  const handleUpsertClose = useCallback(() => {
    setOpenForm(false)
  }, [])

  const handleUpsertOpen = useCallback(() => {
    setOpenForm(true)
  }, [])

  return (
    <>
      <Splitter>
        {/* === TREE VIEW === */}
        <GenericTree<TypeTblStockType>
          label='Tree View'
          loading={loading}
          data={tree}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onDoubleClick={handleEdit}
          onAdd={handleCreate}
          onRefresh={refetch}
          getItemName={getItemName}
          getItemId={getRowId}
        />

        {/* === GRID VIEW === */}
        <CustomizedDataGrid
          showToolbar
          label='List View'
          loading={loading}
          rows={rows}
          columns={columns}
          onEditClick={handleEdit}
          onDeleteClick={handleDelete}
          onDoubleClick={handleEdit}
          onRefreshClick={refetch}
          onAddClick={handleCreate}
          getRowId={getRowId}
        />
      </Splitter>

      {/* === FORM === */}
      <StockTypeFormDialog
        open={openForm}
        mode={mode}
        recordId={selectedRowId}
        onClose={handleUpsertClose}
        onSuccess={refetch}
      />
    </>
  )
}
