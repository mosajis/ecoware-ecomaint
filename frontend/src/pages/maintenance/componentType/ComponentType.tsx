import Splitter from '@/shared/components/Splitter'
import DataGrid from '@/shared/components/dataGrid/DataGrid'
import Tree from '@/shared/components/tree/Tree'
import ComponentTypeUpsert from './ComponentTypeUpsert'

import { useCallback, useMemo, useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import { GridColDef } from '@mui/x-data-grid'
import { dataGridActionColumn } from '@/shared/components/dataGrid/DataGridActionsColumn'
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
  const [openForm, setOpenForm] = useState(false)
  const [mode, setMode] = useState<'create' | 'update'>('create')
  const [selectedTreeIds, setSelectedTreeIds] = useState<string[]>(['20000000'])

  /* ---- Data Tree Hook ---- */
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

  /* ---- Grid Columns ---- */
  const columns = useMemo<GridColDef<TypeTblCompType>[]>(
    () => [
      { field: 'compTypeNo', headerName: 'Code', width: 120 },
      { field: 'compName', headerName: 'Name', flex: 1 },
      { field: 'compType', headerName: 'Model/Type', width: 200 },
      { field: 'orderNo', headerName: 'OrderNo', width: 100 },
    ],
    [handleDelete]
  )

  /* ---- Handlers ---- */
  const handleAddClick = useCallback(() => {
    setSelectedRow(null)
    setMode('create')
    setOpenForm(true)
  }, [])

  const handleTreeSelection = useCallback((ids: string[]) => {
    console.log(ids)
    setSelectedTreeIds(ids)
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

  /* ---- Render ---- */
  return (
    <>
      <Splitter initialPrimarySize='30%'>
        <Tree<TypeTblCompType>
          label='Tree View'
          items={treeItems}
          loading={loading}
          onRefresh={handleRefresh}
          onAddClick={handleAddClick}
          selectedIds={selectedTreeIds}
          onSelect={handleTreeSelection}
          onDoubleClick={handleDoubleClick}
          autoExpandSearch
        />
        <div>
          {JSON.stringify(selectedTreeIds)}
          <DataGrid
            label='List View'
            showToolbar
            rows={rows}
            columns={columns}
            loading={loading}
            getRowId={row => row.compTypeId}
            disableDensity
            disableRowNumber
            disableRowSelectionOnClick
            onAddClick={handleAddClick}
            onRefreshClick={handleRefresh}
            onRowDoubleClick={({ row }) => handleDoubleClick(row)}
          />
        </div>
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
