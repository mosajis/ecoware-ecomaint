import Splitter from '@/shared/components/Splitter/Splitter'
import LocationUpsert from './LocationUpsert'
import GenericDataGrid from '@/shared/components/dataGrid/DataGrid'
import { tblLocation, TypeTblLocation } from '@/core/api/generated/api'
import { GridColDef } from '@mui/x-data-grid'
import { useDataTree } from '@/shared/hooks/useDataTree'
import { useState, useCallback } from 'react'
import { GenericTree } from '@/shared/components/tree/Tree'
import { mapToTree } from '@/shared/components/tree/TreeUtil'

const getRowId = (row: TypeTblLocation) => row.locationId

const columns: GridColDef<TypeTblLocation>[] = [
  { field: 'locationCode', headerName: 'Code', width: 60 },
  { field: 'name', headerName: 'Name', flex: 1 },
  {
    field: 'parentLocation',
    headerName: 'Parent',
    flex: 1,
    valueGetter: (_, row) => row?.tblLocation?.name,
  },
  { field: 'orderNo', headerName: 'Order No', width: 80 },
]

export default function PageLocation() {
  const [openForm, setOpenForm] = useState(false)
  const [mode, setMode] = useState<'create' | 'update'>('create')
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null)

  const treeMapper = useCallback(
    (items: TypeTblLocation[]) =>
      mapToTree(items, 'locationId', 'parentLocationId'),
    []
  )

  const getAll = useCallback(
    () =>
      tblLocation.getAll({
        include: {
          tblLocation: true,
        },
      }),
    []
  )

  const { tree, rows, loading, refetch, handleDelete } =
    useDataTree<TypeTblLocation>({
      getAll,
      deleteById: tblLocation.deleteById,
      getId: item => item.locationId,
      mapper: treeMapper,
    })

  const handleCreate = useCallback(() => {
    setSelectedRowId(null)
    setMode('create')
    handleUpsertOpen()
  }, [])

  const handleEdit = useCallback((rowId: number) => {
    setSelectedRowId(rowId)
    setMode('update')
    handleUpsertOpen()
  }, [])

  const handleUpsertClose = useCallback(() => {
    setOpenForm(false)
  }, [])

  const handleUpsertOpen = useCallback(() => {
    setOpenForm(true)
  }, [])

  return (
    <>
      <Splitter initialPrimarySize='35%'>
        <GenericTree<TypeTblLocation>
          label='Tree View'
          loading={loading}
          data={tree}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onDoubleClick={handleEdit}
          onAdd={handleCreate}
          onRefresh={refetch}
          getItemName={item => item.name || '-'}
          getItemId={getRowId}
        />

        <GenericDataGrid
          label='List View'
          showToolbar
          disableRowNumber
          loading={loading}
          rows={rows}
          columns={columns}
          onDoubleClick={handleEdit}
          onEditClick={handleEdit}
          onDeleteClick={handleDelete}
          onRefreshClick={refetch}
          onAddClick={handleCreate}
          getRowId={getRowId}
        />
      </Splitter>

      <LocationUpsert
        open={openForm}
        mode={mode}
        recordId={selectedRowId}
        onClose={handleUpsertClose}
        onSuccess={refetch}
      />
    </>
  )
}
