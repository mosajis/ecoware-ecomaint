import Splitter from '@/shared/components/Splitter'
import DataGrid from '@/shared/components/dataGrid/DataGrid'
import Tree from '@/shared/components/tree/Tree'
import ComponentTypeUpsert from './ComponentTypeUpsert'

import { useCallback, useMemo, useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import { GridColDef } from '@mui/x-data-grid'
import { tblCompType, TypeTblCompType } from '@/core/api/generated/api'
import { routeComponentTypeDetail } from './ComponentTypeRoutes'
import { useCustomizedTree } from '@/shared/hooks/useDataTree'
import { TreeNode } from '@/shared/components/tree/treeUtil'

/* ---- Mapper ---- */
const mapComponentType = (
  item: TypeTblCompType
): Omit<TreeNode<TypeTblCompType>, 'children'> => ({
  id: item.compTypeId.toString(),
  text: item.compName ?? '',
  label: item.compName ?? '',
  data: item,
})

/* ---- Main Component ---- */
export default function PageComponentTypeList() {
  const router = useRouter()

  const [selectedRow, setSelectedRow] = useState<TypeTblCompType | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null) // <-- مشترک
  const [openForm, setOpenForm] = useState(false)
  const [mode, setMode] = useState<'create' | 'update'>('create')

  const {
    rows,
    treeItems,
    loading,
    handleDelete,
    handleFormSuccess: onFormSuccess,
    handleRefresh,
  } = useCustomizedTree<TypeTblCompType>({
    getAll: tblCompType.getAll,
    deleteById: tblCompType.deleteById,
    keyId: 'compTypeId',
    parentKeyId: 'parentCompTypeId',
    mapper: mapComponentType,
  })

  const columns = useMemo<GridColDef<TypeTblCompType>[]>(
    () => [
      { field: 'compTypeNo', headerName: 'Code', width: 120 },
      { field: 'compName', headerName: 'Name', flex: 1 },
      { field: 'compType', headerName: 'Model/Type', width: 200 },
      { field: 'orderNo', headerName: 'OrderNo', width: 100 },
    ],
    [handleDelete]
  )

  const handleAddClick = useCallback(() => {
    setSelectedRow(null)
    setSelectedId(null)
    setMode('create')
    setOpenForm(true)
  }, [])

  const handleDoubleClick = useCallback(
    (row: TypeTblCompType) => {
      router.navigate({
        to: routeComponentTypeDetail.to,
        params: { id: row.compTypeId },
        search: { breadcrumb: row.compName },
      })
    },
    [router]
  )

  const handleFormClose = useCallback(
    (updatedRecord: TypeTblCompType) => {
      onFormSuccess(updatedRecord)
      setOpenForm(false)
    },
    [onFormSuccess]
  )

  /* ---- انتخاب بین Tree و Grid ---- */
  const handleTreeSelect = useCallback(
    (selectedIds: string[]) => {
      const id = selectedIds[0] ?? null
      setSelectedId(id)

      const row = rows.find(r => r.compTypeId.toString() === id)
      if (row) setSelectedRow(row)
    },
    [rows]
  )

  const handleGridSelect = useCallback((row: TypeTblCompType) => {
    setSelectedId(row.compTypeId.toString())
    setSelectedRow(row)
  }, [])

  return (
    <>
      <Splitter initialPrimarySize='30%'>
        <Tree<TypeTblCompType>
          label='Tree View'
          items={treeItems}
          loading={loading}
          onRefresh={handleRefresh}
          onAddClick={handleAddClick}
          onDoubleClick={handleDoubleClick}
          onSelect={handleTreeSelect}
        />
        <DataGrid
          label='List View'
          showToolbar
          rows={rows}
          columns={columns}
          loading={loading}
          getRowId={row => row.compTypeId}
          disableDensity
          disableRowNumber
          onAddClick={handleAddClick}
          onRefreshClick={handleRefresh}
          onRowClick={({ row }) => handleGridSelect(row)}
          onRowDoubleClick={({ row }) => handleDoubleClick(row)}
        />
      </Splitter>

      <ComponentTypeUpsert
        open={openForm}
        mode={mode}
        recordId={selectedRow?.compTypeId}
        onClose={() => setOpenForm(false)}
        onSuccess={handleFormClose}
      />
    </>
  )
}
