import Splitter from '@/shared/components/Splitter'
import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import CustomizedTree from '@/shared/components/tree/CustomeTree'
import LocationUpsert from './LocationUpsert'
import { useState, useCallback } from 'react'
import { tblLocation, TypeTblLocation } from '@/core/api/generated/api'
import { dataGridActionColumn } from '@/shared/components/dataGrid/DataGridActionsColumn'
import { GridColDef } from '@mui/x-data-grid'
import { useDataTree } from '@/shared/hooks/useDataTree'

export default function PageLocation() {
  const [openForm, setOpenForm] = useState(false)
  const [mode, setMode] = useState<'create' | 'update'>('create')
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null)

  // === Mapping Transformer ===
  const mapper = useCallback(
    (row: TypeTblLocation) => ({
      id: row.locationId.toString(),
      label: row.name ?? '',
      parentId: row.parentLocationId?.toString() ?? null,
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
    tblLocation.getAll,
    tblLocation.deleteById,
    'locationId',
    mapper
  )

  // === Handlers ===
  const handleCreate = () => {
    setSelectedRowId(null)
    setMode('create')
    setOpenForm(true)
  }

  const handleEdit = (row: TypeTblLocation) => {
    setSelectedRowId(row.locationId)
    setMode('update')
    setOpenForm(true)
  }

  // === Columns ===
  const columns: GridColDef<TypeTblLocation>[] = [
    { field: 'locationCode', headerName: 'Code', width: 60 },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'orderId', headerName: 'Order No', width: 80 },
    dataGridActionColumn({
      onEdit: handleEdit,
      onDelete: handleDelete,
    }),
  ]

  return (
    <>
      <Splitter initialPrimarySize='35%'>
        {/* === TREE VIEW === */}
        <CustomizedTree
          onRefresh={handleRefresh}
          label='Tree View'
          items={treeItems}
          loading={loading}
          getRowId={row => row.locationId}
          onAddClick={handleCreate}
          onEditClick={handleEdit}
          onDeleteClick={handleDelete}
        />

        {/* === GRID VIEW === */}
        <CustomizedDataGrid
          showToolbar
          disableRowNumber
          label='List View'
          loading={loading}
          rows={rows}
          columns={columns}
          onRefreshClick={handleRefresh}
          onAddClick={handleCreate}
          getRowId={row => row.locationId}
        />
      </Splitter>

      {/* === FORM === */}
      <LocationUpsert
        open={openForm}
        mode={mode}
        recordId={selectedRowId}
        onClose={() => setOpenForm(false)}
        onSuccess={handleFormSuccess}
      />
    </>
  )
}
