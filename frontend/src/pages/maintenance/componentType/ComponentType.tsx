import Splitter from '@/shared/components/Splitter/Splitter'
import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import ComponentTypeUpsert from './ComponentTypeUpsert'
import { useRouter } from '@tanstack/react-router'
import { routeComponentTypeDetail } from './ComponentTypeRoutes'
import { useDataTree } from '@/shared/hooks/useDataTree'
import { mapToTree } from '@/shared/components/tree/TreeUtil'
import { GenericTree } from '@/shared/components/tree/Tree'
import { GridColDef } from '@mui/x-data-grid'
import { useCallback, useState } from 'react'
import { tblCompType, TypeTblCompType } from '@/core/api/generated/api'

const getRowId = (row: TypeTblCompType) => row.compTypeId
const getItemName = (row: TypeTblCompType) => row.compName || '-'

const columns: GridColDef<TypeTblCompType>[] = [
  { field: 'compTypeNo', headerName: 'Code', width: 120 },
  { field: 'compName', headerName: 'Name', flex: 1 },
  { field: 'compType', headerName: 'Model/Type', width: 200 },
  { field: 'orderNo', headerName: 'OrderNo', width: 100 },
]

export default function PageComponentType() {
  const router = useRouter()

  const [selectedRowId, setSelectedRowId] = useState<null | number>(null)
  const [openForm, setOpenForm] = useState(false)
  const [mode, setMode] = useState<'create' | 'update'>('create')

  const treeMapper = useCallback(
    (items: TypeTblCompType[]) =>
      mapToTree(items, 'compTypeId', 'parentCompTypeId'),
    []
  )

  const { rows, tree, loading, refetch, handleDelete } =
    useDataTree<TypeTblCompType>({
      getAll: tblCompType.getAll,
      deleteById: tblCompType.deleteById,
      getId: getRowId,
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

  const handleRowDoubleClick = useCallback(
    (rowId: number) => {
      const row = rows.find(i => i.compTypeId === rowId)

      if (!row) return
      router.navigate({
        to: routeComponentTypeDetail.to,
        params: { id: rowId },
        search: { breadcrumb: row?.compName },
      })
    },
    [router, rows]
  )

  return (
    <>
      <Splitter initialPrimarySize='30%'>
        <GenericTree<TypeTblCompType>
          label='Tree View'
          loading={loading}
          data={tree}
          onDoubleClick={handleRowDoubleClick}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAdd={handleCreate}
          onRefresh={refetch}
          getItemId={getRowId}
          getItemName={getItemName}
        />
        <CustomizedDataGrid
          showToolbar
          disableRowNumber
          label='List View'
          rows={rows}
          columns={columns}
          loading={loading}
          getRowId={getRowId}
          onEditClick={handleEdit}
          onDeleteClick={handleDelete}
          onDoubleClick={handleRowDoubleClick}
          onAddClick={handleCreate}
          onRefreshClick={refetch}
        />
      </Splitter>

      <ComponentTypeUpsert
        open={openForm}
        mode={mode}
        recordId={selectedRowId}
        onClose={handleUpsertClose}
        onSuccess={refetch}
      />
    </>
  )
}
